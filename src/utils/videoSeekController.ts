/**
 * VideoSeekController — sincroniza `video.currentTime` com o progresso do scroll.
 *
 * Princípios (hotfix dos travamentos do Hero):
 *  - Mantém SOMENTE o destino mais recente (nunca uma fila de seeks antigos).
 *  - Nunca bloqueia o scroll: roda em requestAnimationFrame, fora do fluxo de scroll.
 *  - Nunca depende exclusivamente do evento `seeked`: um watchdog reemite o destino
 *    mais recente se o seek em andamento demorar demais.
 *  - Não cria espera infinita: se o seek ficar preso, desiste até o próximo scroll.
 *  - O destino é guardado como PROGRESSO (0..1); a conversão para segundos usa a
 *    duração real, que pode chegar depois (loadedmetadata).
 */

export interface SeekableVideo {
  currentTime: number;
  readonly duration: number;
  readonly seeking: boolean;
  readonly readyState: number;
}

export interface SeekStats {
  issued: number;
  staleRetries: number;
  giveUps: number;
}

export interface SeekControllerOptions {
  /** Se o vídeo progride na ordem invertida (1 -> 0) em relação ao scroll (0 -> 1). */
  inverted?: boolean;
  /** Diferença mínima (s) que justifica um novo seek. Menor que 1 frame a 30fps. */
  epsilon?: number;
  /** Seek em andamento há mais que isso (ms) é considerado obsoleto: reemite o destino atual. */
  retryMs?: number;
  /** Seek para o MESMO destino sem concluir por tanto tempo (ms): reemite uma vez e desiste. */
  giveUpMs?: number;
  /** Margem final para evitar seek exatamente em `duration` (alguns navegadores exibem preto). */
  tailGuard?: number;
  now?: () => number;
  schedule?: (cb: () => void) => number;
  cancel?: (id: number) => void;
}

export class VideoSeekController {
  readonly stats: SeekStats & { framesDelivered: number; rVFCSupported: boolean } = {
    issued: 0,
    staleRetries: 0,
    giveUps: 0,
    framesDelivered: 0,
    rVFCSupported: false,
  };

  private progress = 0;
  private requested: number | null = null;
  private issuedAt = 0;
  private reissued = false;
  private frame: number | null = null;
  private rvfcHandle: number | null = null;
  private isAwaitingFrame = false;

  readonly inverted: boolean;
  private readonly epsilon: number;
  private readonly retryMs: number;
  private readonly giveUpMs: number;
  private readonly tailGuard: number;
  private readonly now: () => number;
  private readonly scheduleFn: (cb: () => void) => number;
  private readonly cancelFn: (id: number) => void;

  constructor(
    private readonly getVideo: () => SeekableVideo | null,
    options: SeekControllerOptions = {}
  ) {
    // O arquivo MP4 derivado já está fisicamente na ordem oficial (0s = mulher -> 20s = armação),
    // portanto o progresso 0..1 avança linearmente com o vídeo (inverted = false).
    this.inverted = options.inverted ?? false;
    this.epsilon = options.epsilon ?? 0.02;
    this.retryMs = options.retryMs ?? 50;
    this.giveUpMs = options.giveUpMs ?? 2000;
    this.tailGuard = options.tailGuard ?? 0.05;
    this.now = options.now ?? (() => performance.now());
    this.scheduleFn = options.schedule ?? ((cb) => requestAnimationFrame(cb));
    this.cancelFn = options.cancel ?? ((id) => cancelAnimationFrame(id));
  }

  /** Registra o destino mais recente (progresso 0..1). Barato: chamado a cada tick do scroll. */
  request(progress: number): void {
    this.progress = Math.max(0, Math.min(1, progress));
    this.reissued = false;
    this.schedule();
  }

  /** Reavalia o destino atual (ex.: após seeked / loadedmetadata / volta de aba / rVFC). */
  flush(): void {
    this.isAwaitingFrame = false;
    this.schedule();
  }

  /** Esquece o último seek emitido (ex.: o elemento <video> foi trocado/recarregado). */
  reset(): void {
    this.requested = null;
    this.reissued = false;
    this.isAwaitingFrame = false;
  }

  /** Cancela o frame pendente e listeners de vídeo. O controlador continua utilizável. */
  cancel(): void {
    if (this.frame !== null) {
      this.cancelFn(this.frame);
      this.frame = null;
    }
    const video = this.getVideo() as (HTMLVideoElement & { cancelVideoFrameCallback?: (id: number) => void }) | null;
    if (video && this.rvfcHandle !== null && typeof video.cancelVideoFrameCallback === 'function') {
      video.cancelVideoFrameCallback(this.rvfcHandle);
      this.rvfcHandle = null;
    }
    this.isAwaitingFrame = false;
  }

  getProgress(): number {
    return this.progress;
  }

  /** Retorna o tempo alvo correspondente ao progresso atual considerando a inversão. */
  getTargetTime(duration: number): number {
    if (!Number.isFinite(duration) || duration <= 0) return 0;
    const effectiveProgress = this.inverted ? (1 - this.progress) : this.progress;
    return Math.max(0, Math.min(effectiveProgress * duration, duration - this.tailGuard));
  }

  private schedule(): void {
    if (this.frame !== null) return;
    this.frame = this.scheduleFn(this.tick);
  }

  private hookVideoFrameCallback(video: SeekableVideo): void {
    const htmlVideo = video as HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: (now: number, meta: unknown) => void) => number;
    };
    if (typeof htmlVideo.requestVideoFrameCallback === 'function') {
      this.stats.rVFCSupported = true;
      if (!this.isAwaitingFrame) {
        this.isAwaitingFrame = true;
        this.rvfcHandle = htmlVideo.requestVideoFrameCallback(() => {
          this.stats.framesDelivered += 1;
          this.isAwaitingFrame = false;
          this.rvfcHandle = null;
          // Frame efetivamente pintado pelo compositor da GPU: reavalia se há novo destino
          this.schedule();
        });
      }
    }
  }

  private issue(video: SeekableVideo, target: number, now: number): void {
    this.requested = target;
    this.issuedAt = now;
    this.stats.issued += 1;
    this.hookVideoFrameCallback(video);

    try {
      // Usa currentTime direto (com GOP curto -g 6 e -bf 0 no MP4, o seek é frame-accurate em <3ms)
      video.currentTime = target;
    } catch {
      /* readyState insuficiente: o próximo flush() (loadedmetadata) reavalia */
    }
  }

  private tick = (): void => {
    this.frame = null;
    const video = this.getVideo();
    if (!video) return;

    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0 || video.readyState < 1) return;

    const target = this.getTargetTime(duration);
    const now = this.now();

    // Já está no quadro exato alvo: não faz seek redundante.
    if (!video.seeking && Math.abs(video.currentTime - target) < this.epsilon) {
      this.requested = target;
      return;
    }

    const changed = this.requested === null || Math.abs(this.requested - target) >= this.epsilon;

    // Seek concluído para este destino (mesmo que o navegador tenha ajustado ao quadro).
    if (!video.seeking && !changed) return;

    if (changed) {
      if (!video.seeking) {
        this.issue(video, target, now);
      } else {
        // Se o seek em andamento demorar mais do que retryMs, OU se a diferença de destino for
        // substancial (usuário continuou rolando rápido), substitui pelo destino MAIS RECENTE.
        const delta = this.requested !== null ? Math.abs(this.requested - target) : 0;
        const dynamicRetry = delta > 0.5 ? 60 : this.retryMs;
        if (now - this.issuedAt >= dynamicRetry) {
          this.stats.staleRetries += 1;
          this.issue(video, target, now);
        }
      }
      return;
    } else if (now - this.issuedAt >= this.giveUpMs) {
      // Mesmo destino sem concluir: reemite uma vez e desiste até novo scroll.
      if (this.reissued) {
        this.stats.giveUps += 1;
        return;
      }
      this.reissued = true;
      this.issue(video, target, now);
    }

    this.schedule();
  };
}
