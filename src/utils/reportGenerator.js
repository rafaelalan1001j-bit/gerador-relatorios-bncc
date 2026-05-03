// BNCC Report Text Generator
// Motor de geração automática de relatórios pedagógicos baseado em banco de frases

const FRASES = {
  introducao: [
    (aluno, escola) => `O presente relatório tem por objetivo apresentar o desenvolvimento pedagógico de ${aluno.nome}, criança de ${aluno.idade} anos, pertencente à ${aluno.turma} da ${escola.nome}, no período letivo referente ao ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}.`,
    (aluno, escola) => `Este documento registra, de forma descritiva e reflexiva, o percurso de aprendizagem e desenvolvimento integral de ${aluno.nome}, de ${aluno.idade} anos, integrante da ${aluno.turma} na ${escola.nome}.`,
    (aluno, escola) => `A seguir, apresentamos o relatório individual de desenvolvimento de ${aluno.nome}, criança de ${aluno.idade} anos da ${aluno.turma}, elaborado com base nas observações pedagógicas realizadas ao longo do período na ${escola.nome}.`,
  ],
  
  participacao: {
    ativa: [
      (nome) => `${nome} demonstrou participação ativa e entusiasta durante todas as atividades propostas, engajando-se com interesse genuíno nas experiências de aprendizagem.`,
      (nome) => `Ao longo das atividades, ${nome} evidenciou um envolvimento intenso e constante, contribuindo de forma significativa para a dinâmica do grupo.`,
      (nome) => `${nome} apresentou participação notadamente ativa, expressando suas ideias com confiança e motivação em todos os momentos pedagógicos.`,
    ],
    moderada: [
      (nome) => `${nome} participou de maneira moderada das atividades propostas, demonstrando interesse em determinados momentos e maior reserva em outros.`,
      (nome) => `A participação de ${nome} ocorreu de forma seletiva, com envolvimento mais expressivo nas atividades que despertaram maior curiosidade.`,
      (nome) => `${nome} demonstrou uma participação equilibrada, engajando-se com entusiasmo quando o contexto lhe favorecia, mantendo-se observador(a) em outras situações.`,
    ],
    baixa: [
      (nome) => `${nome} apresentou menor participação nas atividades coletivas neste período, necessitando de estímulo adicional para engajar-se nas propostas pedagógicas.`,
      (nome) => `Observou-se que ${nome} ainda está em processo de adaptação ao ambiente e à dinâmica coletiva, respondendo timidamente às atividades propostas.`,
      (nome) => `${nome} demonstrou participação ainda inicial, indicando que há espaço para fortalecer o vínculo e o envolvimento com as experiências do grupo.`,
    ],
  },

  comportamento: {
    timido: [
      (nome) => `No que se refere ao comportamento, ${nome} apresentou-se como uma criança reservada e observadora, preferindo explorar o ambiente antes de interagir.`,
      (nome) => `${nome} demonstrou timidez natural nas interações sociais, o que é completamente esperado nesta faixa etária, revelando uma personalidade introspectiva e reflexiva.`,
      (nome) => `A criança mostrou-se um(a) observador(a) atento(a), absorvendo o ambiente e participando à sua maneira, respeitando seu próprio ritmo de socialização.`,
    ],
    interativo: [
      (nome) => `${nome} é uma criança notadamente interativa, buscando ativamente o contato com os colegas e a professora, o que enriquece o clima de aprendizagem do grupo.`,
      (nome) => `Quanto ao comportamento social, ${nome} destacou-se pela facilidade de interação, estabelecendo vínculos com os pares e participando ativamente das dinâmicas coletivas.`,
      (nome) => `${nome} revelou-se uma criança comunicativa e aberta ao contato, contribuindo para um ambiente de sala de aula colaborativo e acolhedor.`,
    ],
    colaborativo: [
      (nome) => `${nome} demonstrou um comportamento marcadamente colaborativo, auxiliando os colegas e compreendendo a importância do trabalho em equipe.`,
      (nome) => `A criança revelou habilidades de cooperação e solidariedade, sendo reconhecida pelos pares pela disposição em compartilhar e ajudar.`,
      (nome) => `${nome} apresentou postura colaborativa e empática, compreendendo as necessidades dos colegas e contribuindo positivamente para o grupo.`,
    ],
  },

  desenvolvimento: {
    avancado: [
      (nome) => `${nome} encontra-se em nível avançado de desenvolvimento, superando as expectativas para sua faixa etária e demonstrando maturidade cognitiva e socioemocional.`,
      (nome) => `O desenvolvimento de ${nome} é notadamente avançado, com aquisições que revelam grande capacidade de aprendizagem e pensamento crítico.`,
      (nome) => `${nome} apresenta desenvolvimento pleno e consistente, consolidando habilidades com autonomia e demonstrando prontidão para novas aprendizagens.`,
    ],
    em_processo: [
      (nome) => `${nome} encontra-se em processo contínuo de aprendizagem, avançando gradualmente na consolidação das habilidades previstas para o período.`,
      (nome) => `O desenvolvimento de ${nome} segue seu percurso natural, com aquisições acontecendo de forma progressiva e consistente ao longo das experiências propostas.`,
      (nome) => `${nome} está construindo suas aprendizagens de forma segura e gradual, com avanços perceptíveis que indicam um desenvolvimento saudável e coerente.`,
    ],
    necessita_apoio: [
      (nome) => `${nome} necessita de apoio pedagógico adicional para consolidar as aprendizagens previstas, sendo fundamental o acompanhamento individualizado e contínuo.`,
      (nome) => `O percurso de ${nome} indica a necessidade de intervenções pedagógicas mais direcionadas, com estratégias diferenciadas para favorecer o desenvolvimento integral.`,
      (nome) => `${nome} apresenta algumas dificuldades que requerem atenção especial, sendo recomendado um trabalho conjunto entre família e escola para apoiar seu desenvolvimento.`,
    ],
  },

  linguagem: {
    fluente: (nome) => `${nome} expressa-se oralmente com fluência e clareza, utilizando vocabulário rico e adequado à sua faixa etária para comunicar pensamentos e sentimentos.`,
    em_processo: (nome) => `A linguagem oral de ${nome} está em franco desenvolvimento, com progressos perceptíveis na capacidade de expressão verbal ao longo do período.`,
    inicial: (nome) => `${nome} está no estágio inicial do desenvolvimento da linguagem oral, sendo estimulado(a) continuamente por meio de rodas de conversa, músicas e contação de histórias.`,
  },

  leitura: {
    alto: (nome) => `${nome} demonstra elevado interesse pela leitura, manuseando livros com cuidado e atenção, antecipando narrativas a partir das ilustrações e contextos.`,
    medio: (nome) => `${nome} demonstra interesse pela leitura em situações específicas, respondendo positivamente às atividades de contação de histórias e manuseio de livros.`,
    baixo: (nome) => `${nome} está desenvolvendo gradualmente o interesse pela leitura, sendo estimulado(a) por meio de estratégias lúdicas que aproximam o texto da sua realidade.`,
  },

  matematica: {
    avancado: (nome) => `No campo lógico-matemático, ${nome} demonstra domínio consistente da contagem e da correspondência número-quantidade, realizando agrupamentos e comparações com autonomia.`,
    em_processo: (nome) => `${nome} está construindo seu pensamento lógico-matemático de forma gradual, avançando na compreensão da contagem e das relações entre número e quantidade.`,
    inicial: (nome) => `O raciocínio lógico-matemático de ${nome} encontra-se em fase inicial, sendo desenvolvido por meio de brincadeiras, jogos e situações do cotidiano.`,
  },

  motor: {
    excelente: (nome) => `${nome} apresenta excelente desenvolvimento motor, com coordenação fina e ampla bem consolidadas, realizando atividades que requerem precisão e equilíbrio com segurança.`,
    bom: (nome) => `O desenvolvimento motor de ${nome} é satisfatório, com coordenação fina e ampla adequadas à faixa etária, participando com entusiasmo das atividades corporais.`,
    em_processo: (nome) => `${nome} está desenvolvendo sua coordenação motora de forma progressiva, com avanços perceptíveis tanto na motricidade fina quanto na ampla ao longo do período.`,
  },

  sequenciaDidatica: (plano, aluno) => [
    `Durante o período analisado, ${aluno.nome} participou da sequência didática "${plano.tema}", cujos objetivos principais foram: ${plano.objetivos}. As atividades realizadas incluíram: ${plano.atividades}.`,
    `A proposta pedagógica desenvolvida com o tema "${plano.tema}" proporcionou a ${aluno.nome} experiências significativas de aprendizagem. As atividades desenvolvidas foram: ${plano.atividades}.`,
    `No contexto da sequência didática "${plano.tema}", ${aluno.nome} vivenciou experiências que abarcaram ${plano.objetivos}. As ações pedagógicas envolveram: ${plano.atividades}.`,
  ],

  camposBNCC: {
    'O eu, o outro e o nós': [
      (nome) => `No campo de experiências "O eu, o outro e o nós", ${nome} demonstrou habilidades relacionadas à construção da identidade, à empatia e às relações interpessoais.`,
      (nome) => `As experiências do campo "O eu, o outro e o nós" permitiram a ${nome} ampliar sua compreensão sobre si mesmo(a) e sobre o mundo social que o(a) cerca.`,
    ],
    'Corpo, gestos e movimentos': [
      (nome) => `No campo "Corpo, gestos e movimentos", ${nome} explorou diferentes formas de expressão corporal, desenvolvendo consciência sobre as possibilidades do próprio corpo.`,
      (nome) => `As vivências do campo "Corpo, gestos e movimentos" permitiram a ${nome} ampliar suas habilidades expressivas e motoras por meio de brincadeiras e atividades lúdicas.`,
    ],
    'Traços, sons, cores e formas': [
      (nome) => `No campo "Traços, sons, cores e formas", ${nome} teve oportunidade de explorar linguagens artísticas diversas, desenvolvendo sensibilidade estética e criatividade.`,
      (nome) => `As experiências artísticas do campo "Traços, sons, cores e formas" proporcionaram a ${nome} vivências ricas em expressão plástica, musical e visual.`,
    ],
    'Escuta, fala, pensamento e imaginação': [
      (nome) => `No campo "Escuta, fala, pensamento e imaginação", ${nome} desenvolveu habilidades de comunicação oral, ampliou o vocabulário e fortaleceu o interesse pela narrativa e pela leitura.`,
      (nome) => `As atividades do campo "Escuta, fala, pensamento e imaginação" favoreceram em ${nome} o desenvolvimento da linguagem oral, da escuta ativa e da produção de sentidos.`,
    ],
    'Espaços, tempos, quantidades, relações e transformações': [
      (nome) => `No campo "Espaços, tempos, quantidades, relações e transformações", ${nome} desenvolveu o pensamento lógico e científico, explorando propriedades dos objetos e fenômenos naturais.`,
      (nome) => `As experiências do campo "Espaços, tempos, quantidades, relações e transformações" estimularam em ${nome} a curiosidade investigativa e o raciocínio matemático e científico.`,
    ],
  },

  conclusao: {
    avancado: [
      (nome, turma) => `Diante do exposto, ${nome} apresenta um desenvolvimento integral muito satisfatório, consolidando as aprendizagens esperadas com autonomia e entusiasmo. Recomenda-se a continuidade das propostas pedagógicas desafiadoras, visando ampliar ainda mais seu potencial. O diálogo constante entre família e escola é fundamental para dar sustentação aos avanços conquistados.`,
      (nome) => `${nome} demonstrou ao longo do período um percurso de aprendizagem consistente e enriquecedor. Suas conquistas refletem dedicação, curiosidade e um ambiente familiar favorável ao desenvolvimento. Recomenda-se manter o estímulo à leitura, à escrita e às experiências culturais diversificadas.`,
    ],
    em_processo: [
      (nome) => `${nome} encontra-se em processo contínuo de aprendizagem, avançando gradualmente em todas as dimensões do desenvolvimento. Recomenda-se a intensificação de propostas que favoreçam a autonomia e o engajamento, bem como o fortalecimento da parceria entre escola e família.`,
      (nome) => `O percurso de ${nome} revela um desenvolvimento em progressão, com aquisições significativas e outras ainda em consolidação. Sugere-se que as experiências sejam ampliadas tanto no contexto escolar quanto no familiar, com ênfase em atividades lúdicas e de expressão.`,
    ],
    necessita_apoio: [
      (nome) => `${nome} necessita de acompanhamento mais próximo e estratégias pedagógicas diferenciadas para avançar em seu desenvolvimento. Recomenda-se fortemente a articulação entre família, escola e, se necessário, profissionais especializados, para garantir o suporte adequado à criança.`,
      (nome) => `Visando favorecer o desenvolvimento pleno de ${nome}, faz-se necessário intensificar as intervenções pedagógicas individualizadas e estabelecer um plano de acompanhamento com a família. A criança tem potencial e, com o apoio adequado, poderá avançar significativamente.`,
    ],
  },
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const gerarRelatorio = (aluno, avaliacao, plano, escola) => {
  const nome = aluno.nome.split(' ')[0]; // primeiro nome

  // 1. Introdução
  const introducao = pick(FRASES.introducao)(aluno, escola);

  // 2. Desenvolvimento da criança
  const participacaoText = pick(FRASES.participacao[avaliacao.participacao] || FRASES.participacao.moderada)(nome);
  const comportamentoText = pick(FRASES.comportamento[avaliacao.comportamento] || FRASES.comportamento.interativo)(nome);
  const desenvolvimentoText = pick(FRASES.desenvolvimento[avaliacao.desenvolvimento] || FRASES.desenvolvimento.em_processo)(nome);
  const linguagemText = FRASES.linguagem[avaliacao.linguagemOral] ? FRASES.linguagem[avaliacao.linguagemOral](nome) : '';
  const leituraText = FRASES.leitura[avaliacao.interesseLeitura] ? FRASES.leitura[avaliacao.interesseLeitura](nome) : '';
  const matematicaText = FRASES.matematica[avaliacao.matematicaContagem] ? FRASES.matematica[avaliacao.matematicaContagem](nome) : '';
  const motorText = FRASES.motor[avaliacao.motorAmplo] ? FRASES.motor[avaliacao.motorAmplo](nome) : '';

  // 3. Sequências didáticas
  const sequenciaText = pick(FRASES.sequenciaDidatica(plano, aluno));

  // 4. Campos da BNCC
  const camposTexts = (plano.camposExperiencia || []).map(campo => {
    const frases = FRASES.camposBNCC[campo];
    return frases ? pick(frases)(nome) : '';
  }).filter(Boolean).join('\n\n');

  // Habilidades BNCC mencionadas
  const habilidadesText = plano.habilidades && plano.habilidades.length > 0
    ? `As habilidades BNCC trabalhadas foram: ${plano.habilidades.join(', ')}.`
    : '';

  // Observações personalizadas
  const observacoesText = avaliacao.observacoes
    ? `Observações complementares: ${avaliacao.observacoes}`
    : '';

  // 5. Conclusão
  const conclusaoFrases = FRASES.conclusao[avaliacao.desenvolvimento] || FRASES.conclusao.em_processo;
  const conclusaoText = pick(conclusaoFrases)(nome, aluno.turma);

  // Montar relatório completo
  const relatorio = {
    titulo: `Relatório de Desenvolvimento Individual – ${aluno.nome}`,
    subtitulo: `${escola.nome} | ${aluno.turma} | ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
    secoes: [
      {
        titulo: '1. Apresentação',
        conteudo: introducao,
      },
      {
        titulo: '2. Desenvolvimento Integral da Criança',
        conteudo: [
          participacaoText,
          comportamentoText,
          desenvolvimentoText,
          linguagemText,
          leituraText,
          matematicaText,
          motorText,
          observacoesText,
        ].filter(Boolean).join('\n\n'),
      },
      {
        titulo: '3. Sequências Didáticas e Atividades Realizadas',
        conteudo: [sequenciaText, habilidadesText].filter(Boolean).join('\n\n'),
      },
      {
        titulo: '4. Campos de Experiência da BNCC',
        conteudo: camposTexts || 'Múltiplos campos de experiência da BNCC foram contemplados nas atividades realizadas durante o período.',
      },
      {
        titulo: '5. Considerações Pedagógicas e Perspectivas',
        conteudo: conclusaoText,
      },
    ],
    geradoEm: new Date().toISOString(),
    professor: 'Ana Paula Ferreira',
    assinatura: `${escola.nome} – ${new Date().getFullYear()}`,
  };

  return relatorio;
};
