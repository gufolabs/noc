import type { Disposer, TranslateBounds, TranslateBoundsResolver, ViewportStateSnapshot } from './types';
import { clamp } from './geometry';

type Listener = (snapshot: ViewportStateSnapshot) => void;

export class ViewportState {
  private readonly listeners = new Set<Listener>();

  private snapshot: ViewportStateSnapshot;

  private translateBoundsResolver: TranslateBoundsResolver | null = null;

  public constructor(initialScale: number, minScale: number, maxScale: number) {
    const clampedInitial = this.clampScale(initialScale, minScale, maxScale);
    this.snapshot = {
      scale: clampedInitial,
      tx: 0,
      ty: 0,
      minScale,
      maxScale
    };
  }

  public getSnapshot(): ViewportStateSnapshot {
    return { ...this.snapshot };
  }

  public subscribe(listener: Listener): Disposer {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public setScale(scale: number): void {
    const nextScale = this.clampScale(scale, this.snapshot.minScale, this.snapshot.maxScale);
    const constrained = this.constrainTranslate(nextScale, this.snapshot.tx, this.snapshot.ty);
    if (
      nextScale === this.snapshot.scale &&
      constrained.tx === this.snapshot.tx &&
      constrained.ty === this.snapshot.ty
    ) {
      return;
    }
    this.snapshot = {
      ...this.snapshot,
      scale: nextScale,
      tx: constrained.tx,
      ty: constrained.ty
    };
    this.emit();
  }

  public setTranslate(tx: number, ty: number): void {
    const constrained = this.constrainTranslate(this.snapshot.scale, tx, ty);
    if (constrained.tx === this.snapshot.tx && constrained.ty === this.snapshot.ty) {
      return;
    }
    this.snapshot = {
      ...this.snapshot,
      tx: constrained.tx,
      ty: constrained.ty
    };
    this.emit();
  }

  public setViewport(scale: number, tx: number, ty: number): void {
    const nextScale = this.clampScale(scale, this.snapshot.minScale, this.snapshot.maxScale);
    const constrained = this.constrainTranslate(nextScale, tx, ty);
    if (
      nextScale === this.snapshot.scale &&
      constrained.tx === this.snapshot.tx &&
      constrained.ty === this.snapshot.ty
    ) {
      return;
    }
    this.snapshot = {
      ...this.snapshot,
      scale: nextScale,
      tx: constrained.tx,
      ty: constrained.ty
    };
    this.emit();
  }

  public setTranslateBoundsResolver(resolver: TranslateBoundsResolver | null): void {
    this.translateBoundsResolver = resolver;
    this.enforceConstraints();
  }

  public enforceConstraints(): void {
    const constrained = this.constrainTranslate(this.snapshot.scale, this.snapshot.tx, this.snapshot.ty);
    if (constrained.tx === this.snapshot.tx && constrained.ty === this.snapshot.ty) {
      return;
    }
    this.snapshot = {
      ...this.snapshot,
      tx: constrained.tx,
      ty: constrained.ty
    };
    this.emit();
  }

  public panBy(dx: number, dy: number): void {
    this.setTranslate(this.snapshot.tx + dx, this.snapshot.ty + dy);
  }

  private emit(): void {
    const current = this.getSnapshot();
    this.listeners.forEach((listener) => {
      listener(current);
    });
  }

  private clampScale(scale: number, minScale: number, maxScale: number): number {
    if (Number.isNaN(scale) || !Number.isFinite(scale)) {
      return minScale;
    }
    return Math.min(maxScale, Math.max(minScale, scale));
  }

  private constrainTranslate(scale: number, tx: number, ty: number): { tx: number; ty: number } {
    if (!this.translateBoundsResolver) {
      return { tx, ty };
    }

    const bounds = this.translateBoundsResolver({
      ...this.snapshot,
      scale,
      tx,
      ty
    });
    if (!bounds) {
      return { tx, ty };
    }

    const normalizedBounds = this.normalizeBounds(bounds);
    return {
      tx: clamp(tx, normalizedBounds.minTx, normalizedBounds.maxTx),
      ty: clamp(ty, normalizedBounds.minTy, normalizedBounds.maxTy)
    };
  }

  private normalizeBounds(bounds: TranslateBounds): TranslateBounds {
    return {
      minTx: Math.min(bounds.minTx, bounds.maxTx),
      maxTx: Math.max(bounds.minTx, bounds.maxTx),
      minTy: Math.min(bounds.minTy, bounds.maxTy),
      maxTy: Math.max(bounds.minTy, bounds.maxTy)
    };
  }
}
