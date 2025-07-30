
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface GifViewerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseName: string;
  gifUrl: string | null;
}

export function GifViewer({ isOpen, onOpenChange, exerciseName, gifUrl }: GifViewerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[90%] rounded-lg">
        <DialogHeader>
          <DialogTitle>{exerciseName}</DialogTitle>
          <DialogDescription>
            Observe a execução correta do movimento.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-center items-center">
            {gifUrl ? (
                 // eslint-disable-next-line @next/next/no-img-element
                <img src={gifUrl} alt={`Animação do exercício ${exerciseName}`} className="rounded-lg" />
            ) : (
                <div className="text-center p-4">
                    <p className="text-muted-foreground">Animação não encontrada.</p>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
