import type { WorkoutPlan } from '@/types/workout';

export const initialData: WorkoutPlan = {
  segunda: {
    title: 'Treino A (Empurrar)',
    exercises: [
      { id: 'seg-1', name: 'Supino Reto (Barra ou Halteres)', reps: '3x 10-12', notes: '<strong>FOCO:</strong> Mantenha os pés firmes no chão e o corpo estável. NÃO arqueie excessivamente as costas.', completed: true },
      { id: 'seg-2', name: 'Supino Inclinado (Barra ou Halteres)', reps: '3x 10-12', notes: 'Essa variação trabalha a parte superior do peitoral. <strong>CONTROLE</strong> o movimento na descida.', completed: false },
      { id: 'seg-3', name: 'Desenvolvimento na Máquina', reps: '3x 12-15', notes: 'Mantenha a postura correta e <strong>EVITE</strong> estender completamente os cotovelos no topo.', completed: false },
      { id: 'seg-4', name: 'Elevação Lateral', reps: '3x 12-15', notes: 'Eleve os braços até a altura dos ombros, mantendo uma leve flexão nos cotovelos. <strong>CONTROLE</strong> a descida.', completed: false },
    ]
  },
  terca: {
    title: 'Treino B (Puxar)',
    exercises: [
      { id: 'ter-1', name: 'Puxada Frontal', reps: '3x 10-12', notes: 'Puxe a barra em direção à parte superior do peito, estufando o peito.', completed: false },
      { id: 'ter-2', name: 'Remada Curvada', reps: '3x 10-12', notes: 'Mantenha as costas retas e puxe a barra em direção ao abdômen.', completed: false },
      { id: 'ter-3', name: 'Rosca Direta (Barra ou Halteres)', reps: '3x 12-15', notes: '<strong>EVITE</strong> balançar o corpo. O movimento é só nos cotovelos.', completed: false },
      { id: 'ter-4', name: 'Rosca Martelo', reps: '3x 12-15', notes: 'Pegada neutra (martelo) para trabalhar diferentes partes do bíceps.', completed: false },
    ]
  },
  quarta: {
    title: 'Treino C (Pernas)',
    exercises: [
      { id: 'qua-1', name: 'Agachamento Livre', reps: '3x 10-12', notes: 'O movimento mais completo para pernas. Mantenha a coluna reta!', completed: false },
      { id: 'qua-2', name: 'Leg Press', reps: '3x 10-12', notes: 'Permite focar na força das pernas com segurança para as costas.', completed: false },
      { id: 'qua-3', name: 'Cadeira Extensora', reps: '3x 12-15', notes: 'Isole o quadríceps. Segure por 1 segundo no pico da contração.', completed: false },
      { id: 'qua-4', name: 'Mesa Flexora', reps: '3x 12-15', notes: 'Foco total nos músculos posteriores da coxa.', completed: false },
      { id: 'qua-5', name: 'Panturrilha em Pé', reps: '3x 15-20', notes: 'Alongue bem na descida e contraia ao máximo na subida.', completed: false },
    ]
  },
  quinta: {
    title: 'Foco em Cardio & Core',
    exercises: [
      { id: 'qui-1', name: 'Cardio (Corrida, Bicicleta, Elíptico)', reps: '30 min', notes: 'Mantenha um ritmo constante que desafie sua respiração.', completed: false },
      { id: 'qui-2', name: 'Prancha Isométrica', reps: '4x 45-60 seg', notes: 'Mantenha o abdômen contraído e o corpo reto como uma prancha.', completed: false },
      { id: 'qui-3', name: 'Abdominal Remador', reps: '4x 15-20', notes: 'Movimento completo que trabalha todo o abdômen.', completed: false },
    ]
  },
  sexta: {
    title: 'Full Body & Ombros',
    exercises: [
      { id: 'sex-1', name: 'Levantamento Terra', reps: '3x 8-10', notes: 'Exercício poderoso para o corpo todo. A técnica é <strong>CRUCIAL</strong>.', completed: false },
      { id: 'sex-2', name: 'Supino Reto (Barra ou Halteres)', reps: '3x 10-12', notes: 'Foque na qualidade do movimento e na contração do peitoral.', completed: false },
      { id: 'sex-3', name: 'Remada Cavalinho', reps: '3x 10-12', notes: 'Excelente para construir densidade no meio das costas.', completed: false },
      { id: 'sex-4', name: 'Desenvolvimento de Ombros (Barra ou Halteres)', reps: '3x 10-12', notes: 'O principal construtor de ombros. Mantenha o core firme.', completed: false },
      { id: 'sex-5', name: 'Elevação Pélvica', reps: '4x 12-15', notes: 'Ativação máxima dos glúteos. Use uma carga desafiadora.', completed: false },
    ]
  },
  reminders: [
    { title: "🎯 Foco na Forma", description: "Nunca sacrifique a postura para levantar mais peso. É melhor fazer com menos peso e da forma correta." },
    { title: "💧 Hidratação é Chave", description: "Beba água antes, durante e depois do treino para manter o desempenho e a recuperação." },
    { title: "🍎 Nutrição Pós-Treino", description: "Consuma uma combinação de proteínas e carboidratos após o treino para ajudar na recuperação muscular." }
  ]
};
