
"use client";

import { useState, useEffect, useCallback }from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

const TIME_OPTIONS = [30, 45, 60, 90, 120]; // in seconds

interface TimerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TimerModal({ isOpen, onOpenChange }: TimerModalProps) {
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || !isOpen) return;

    if (timeRemaining <= 0) {
      setIsRunning(false);
      // Optional: Play a sound
      // new Audio('/path/to/sound.mp3').play();
      return;
    }

    const timerId = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning, timeRemaining, isOpen]);

  const handleStartPause = () => {
    if (timeRemaining > 0) {
        setIsRunning(!isRunning);
    }
  };

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(totalSeconds);
  }, [totalSeconds]);

  const handleSetTime = (seconds: number) => {
    setTotalSeconds(seconds);
    setTimeRemaining(seconds);
    setIsRunning(false);
  }

  // Reset timer whenever the modal is opened or the base time changes
  useEffect(() => {
    handleReset();
  }, [isOpen, handleReset]);


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Timer /> Timer de Descanso</DialogTitle>
          <DialogDescription>
            Controle seu tempo de descanso entre as séries para otimizar seus resultados.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center my-8">
            <div className="text-8xl font-bold font-mono tabular-nums text-primary">
                {formatTime(timeRemaining)}
            </div>
            <div className="flex gap-2 mt-4">
                {TIME_OPTIONS.map(time => (
                    <Button 
                        key={time} 
                        variant={totalSeconds === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSetTime(time)}
                    >
                        {time}s
                    </Button>
                ))}
            </div>
        </div>
        <DialogFooter className="sm:justify-center gap-2">
            <Button onClick={handleStartPause} size="lg" className="w-full sm:w-auto">
                {isRunning ? <Pause className="mr-2"/> : <Play className="mr-2" />}
                {isRunning ? 'Pausar' : 'Iniciar'}
            </Button>
            <Button onClick={handleReset} variant="secondary" size="lg" className="w-full sm:w-auto">
                 <RotateCcw className="mr-2"/>
                 Reiniciar
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
