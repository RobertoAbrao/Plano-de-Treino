import type { WorkoutPlan } from '@/types/workout';

export const initialData: WorkoutPlan = {
  segunda: {
    title: 'Treino C (Pernas)',
    exercises: [
      { id: 'seg-1', name: 'Agachamento Goblet', reps: '3x 10-12', notes: '<strong>EVOLUÇÃO!</strong> Faça o agachamento no banco segurando um halter na frente do peito.', completed: false },
      { id: 'seg-2', name: 'Cadeira Extensora', reps: '3x 8-12', notes: 'Aumente a carga. Segure 1 segundo no pico da contração.', completed: false },
      { id: 'seg-3', name: 'Cadeira Flexora', reps: '3x 8-12', notes: 'Controle o movimento, principalmente na volta.', completed: false },
      { id: 'seg-4', name: 'Panturrilha em Pé', reps: '3x 15-20', notes: '<strong>NOVO!</strong> Pode ser feito em máquina ou com um degrau.', completed: false },
      { id: 'seg-5', name: 'Cardio de Baixo Impacto', reps: '25 min', notes: 'Vamos queimar essas calorias!', completed: false }
    ]
  },
  terca: {
    title: 'Treino A (Empurrar)',
    exercises: [
      { id: 'ter-1', name: 'Supino na Máquina', reps: '3x 8-12', notes: 'Aumente a carga. Foque em "espremer" o peitoral.', completed: false },
      { id: 'ter-2', name: 'Desenvolvimento na Máquina', reps: '3x 8-12', notes: 'Mantenha a postura e controle a descida do peso.', completed: false },
      { id: 'ter-3', name: 'Elevação Lateral (Halteres)', reps: '3x 10-15', notes: '<strong>NOVO!</strong> Para a parte lateral dos ombros. Use peso leve.', completed: false },
      { id: 'ter-4', name: 'Tríceps na Polia (Corda)', reps: '3x 8-12', notes: 'Aumente a carga, mantendo os cotovelos fixos.', completed: false },
      { id: 'ter-5', name: 'Cardio de Baixo Impacto', reps: '25 min', notes: 'Aumentamos o tempo! Elíptico ou Bicicleta.', completed: false }
    ]
  },
  quarta: {
    title: 'Treino B (Puxar)',
    exercises: [
      { id: 'qua-1', name: 'Puxada Frontal (Máquina)', reps: '3x 8-12', notes: 'Aumente a carga. Puxe a barra até a parte de cima do peito.', completed: false },
      { id: 'qua-2', name: 'Remada na Máquina', reps: '3x 8-12', notes: 'Foque em juntar as escápulas (omoplatas) a cada repetição.', completed: false },
      { id: 'qua-3', name: 'Remada Serrote (Halter)', reps: '3x 10 por lado', notes: '<strong>NOVO!</strong> Apoie uma mão no banco. Excelente para as costas.', completed: false },
      { id: 'qua-4', name: 'Rosca com Halteres', reps: '3x 8-12', notes: 'Aumente a carga. Evite balançar o corpo.', completed: false },
      { id: 'qua-5', name: 'Cardio de Baixo Impacto', reps: '25 min', notes: 'Mantenha o ritmo!', completed: false }
    ]
  },
  quinta: {
    title: 'Foco em Cardio & Core',
    exercises: [
      { id: 'qui-1', name: 'Cardio Intervalado', reps: '25-30 min', notes: '<strong>EVOLUÇÃO!</strong> Ex: No elíptico, faça 2 min em ritmo normal e 1 min em ritmo forte. Repita.', completed: false },
      { id: 'qui-2', name: 'Prancha Isométrica', reps: '3x (30-45 seg)', notes: 'Mantenha o corpo reto como uma flecha.', completed: false },
      { id: 'qui-3', name: 'Abdominal Remador', reps: '3x 15', notes: '<strong>NOVO!</strong> Deitado, abrace os joelhos ao subir o tronco.', completed: false }
    ]
  },
  sexta: {
    title: 'Treino Full Body',
    exercises: [
      { id: 'sex-1', name: 'Agachamento Goblet', reps: '3x 10-12', notes: 'Comece com as pernas, seu maior grupo muscular.', completed: false },
      { id: 'sex-2', name: 'Supino na Máquina', reps: '3x 10-12', notes: 'Foque na qualidade do movimento.', completed: false },
      { id: 'sex-3', name: 'Remada na Máquina', reps: '3x 10-12', notes: 'Mantenha o equilíbrio entre empurrar e puxar.', completed: false },
      { id: 'sex-4', name: 'Elevação Lateral', reps: '3x 12-15', notes: 'Para dar um acabamento nos ombros.', completed: false },
      { id: 'sex-5', name: 'Cardio de Baixo Impacto', reps: '20 min', notes: 'Ritmo mais leve para recuperação.', completed: false }
    ]
  }
};
