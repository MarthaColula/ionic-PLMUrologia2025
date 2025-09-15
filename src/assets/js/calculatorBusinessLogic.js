var calculatorBusinessLogicObject = (function () {
  return {
    testGreetingEnglish: function (name) {
      console.warn('Init greetingEnglish from calculatorBusinessLogicObject external js');
      console.warn('hello: ', name);
    },

    getCalculatorResult: function (PLMCalculatorSolutionMethodId, answers) {
      switch (PLMCalculatorSolutionMethodId) {

         case 'calculadoraICIQLUTSqol':
          console.warn('solución Encontrada ejecutando...');
          return this.bodyICIQLUTSqol(answers);
        case 'testosteroneEstradiol':
          console.warn('solución Encontrada ejecutando...');
          return this.bodyTestosteroneEstradiol(answers);
        case 'calculadoraDensidadAntigenoProstatico':
          console.warn('solución Encontrada ejecutando...');
          return this.bodyCalculadoraDensidadAntigenoProstatico(answers);
        case 'fsfi':
          console.warn('solución Encontrada ejecutando... fsfi');
          return this.bodyfsfi(answers);
        case 'mshq':
          console.warn('solución Encontrada ejecutando... mshq');
          return this.bodymshq(answers);
        case 'fai':
          console.warn('solución Encontrada ejecutando... fai');
          return this.bodyfai(answers);
        case 'mrs':
          console.warn('solución Encontrada ejecutando... mrs');
          return this.bodymrs(answers);

        default:
          throw new Error('LOCAL - No se encontro solución a la calculadora.');
      }
    },


     bodymshq(answers) {
      console.warn("init bodymshq", answers);
      var sum = 0;
      var domain1 = 0, domain2 = 0, domain3 = 0, domain4 = 0, domain5 = 0;

      if (answers.q1 && answers.q2 && answers.q3) {
        domain1 = answers.q1 + answers.q2 + answers.q3;
      }
      if (answers.q4) {
        domain2 = answers.q4;
      }
      if (answers.q5 && answers.q6 && answers.q7 && answers.q8 && answers.q9 && answers.q10 && answers.q11) {
        domain3 =  answers.q5 + answers.q6 + answers.q7 + answers.q8 + answers.q9 + answers.q10 + answers.q11;
      }
      if (answers.q12) {
        domain4 = answers.q12;
      }
      if (answers.q13 && answers.q14 && answers.q15 && answers.q16 + answers.q17 && answers.q18) {
        domain5 = answers.q13 + answers.q14 + answers.q15 + answers.q16 + answers.q17 + answers.q18;
      }
     
      console.log('DOMAINS: ', domain1 + ' - ' + domain2 + ' - ' + domain3 + ' - ' + domain4 + ' - ' + domain5);

      var domain = (Number(domain1) + Number(domain2) + Number(domain3) + Number(domain4) + Number(domain5));
      console.log('domain: ', domain);

      var result =
        '<ion-item mode="md" class="ion-text-center" color="plm-light" lines="none"><ion-label class="white-space-ion-label">' +
        "<br><b>Puntuación total del MSHQ =</b> " + domain +
        "<br><b>•Dominio 1 (Erección): </b>" + domain1 + ' puntos de 15' +
        "<br><b>•Dominio 2 (Molestias relacionadas con la erección): </b>" + domain2 + ' puntos de 5' +
        "<br><b>•Dominio 3 (Eyaculación): </b>" + domain3 + ' puntos de 35' +
        "<br><b>•Dominio 4 (Molestias relacionadas con la eyaculación):  </b>" + domain4 + ' puntos de 5' +
        "<br><b>•Dominio 5 (Satisfacción): </b>" + domain5 + ' puntos de 30' +
        "<br><b>•Dominio 6 (Actividad y deseo sexual): </b>no aplica. Este dominio sólo brinda información complementaria para la evaluación clínica específica" +
        "<br><br> El resultado de este cuestionario se utiliza para evaluar la puntuación del cuestionario de salud sexual masculina (MSHQ). Es importante tener en cuenta que la puntuación máxima posible es de 90 puntos (sin contar el último apartado [de la pregunta 19 a la 21], que sólo funciona como información adicional con fines interpretativos). Un valor más alto en la puntuación de cada dominio indica una mejor salud sexual, y menos molestias relacionadas con la función eréctil y la eyaculación." +
        "</ion-label></ion-item>";
      return result;
    },

    bodymrs(answers) {
      console.warn("init MRS", answers);
      var affectationScore = '', affectationPsi = '', affectationSoma = '', affectationUro = '';
      var score = 0, score1 = 0, score2 = 0, score3 = 0;

      score = answers.q1 + answers.q2 + answers.q3 + answers.q4 + answers.q5 + answers.q6 + answers.q7 + answers.q8 + answers.q9 + answers.q10 + answers.q11;
      if (score >= 0 && score <= 4) {
        affectationScore = '•	Sin afectación o poca: 0-4 puntos.';
      } else if (score >= 5 && score <= 8) {
        affectationScore = '• Afectación media: 5-8 puntos.';
      } else if (score >= 9 && score <= 16) {
        affectationScore = '•	Afectación moderada: 9-16 puntos..';
      } else if (score >= 17) {
        affectationScore = '•	Afectación severa: 17 o más puntos..';
      }

      score1 = answers.q5 + answers.q6 + answers.q7 + answers.q8;
      if (score === 0 || score === 1) {
        affectationPsi = '•	Sin afectación o poca: 0-1 puntos.';
      } else if (score1 === 2 || score1 === 3) {
        affectationPsi = '•	Afectación media: 2-3 puntos.';
      } else if (score1 === 4 || score1 === 6) {
        affectationPsi = '•	Afectación moderada: 4-6 puntos.';
      } else if (score1 >= 7) {
        affectationPsi = '•	Afectación severa: 7 o más puntos. ';
      }

      score2 = answers.q9 + answers.q10 + answers.q11;
      if (score2 === 0) {
        affectationUro = '•	Sin afectación o poca: 0 puntos.';
      } else if (score2 === 1) {
        affectationUro = '•	Afectación media: 1 punto.';
      } else if (score2 === 2 || score2 === 3) {
        affectationUro = '•	Afectación moderada: 2-3 puntos.';
      } else if (score2 >= 4) {
        affectationUro = '• Afectación severa: 4 o más puntos. ';
      }

      score3 = answers.q1 + answers.q2 + answers.q3 + answers.q4;
      if (score3 >= 0 && score3 <= 2) {
        affectationSoma = '•	Sin afectación o poca: 0-2 puntos.';
      } else if (score3 === 3 || score3 === 4) {
        affectationSoma = '•	Afectación media: 3-4 puntos.';
      } else if (score3 >= 5 && score3 <= 8) {
        affectationSoma = '•	Afectación moderada: 5-8 puntos.';
      } else if (score3 >= 9) {
        affectationSoma = '•	Afectación severa: 9 o más puntos.';
      }

      var result =
        '<ion-item mode="md" class="ion-text-center" color="plm-light" lines="none">' +
        '<ion-label class="white-space-ion-label"> Grado de afectación por síntomas secundarios al climaterio: <br>' +
        "<br><b> • Puntuación total: " + score + " puntos</b><br>" + affectationScore +
        "<br><b> • Componente psicológico: " + score1 + " puntos</b><br>" + affectationPsi +
        "<br><b> •	Componente somato-vegetativo: " + score3 + " puntos</b><br>" + affectationSoma +
        "<br><b> •	Componente urogenital: " + score2 + " puntos</b><br>" + affectationUro +
        "</ion-label></ion-item>";
      return result;

    },

    bodyTestosteroneEstradiol(answers) {
      console.warn("init TestosteroneEstradiol", answers);
      var ratio = 0;
      var conversionT = 0, conversionE = 0;

      if (answers.unitT === 'ng/dL') {
        /*if (answers.unitE === 'pg/mL') {
          conversionT = (answers.t * 34.66).toFixed(1);
          console.log({ conversionT: conversionT });
          conversionE = (answers.e / 0.2724).toFixed(2);
          console.log({ conversionE: conversionE });
          ratio = (conversionT / conversionE).toFixed(2);
          console.log({ ratio: ratio });
        } else*/
        if (answers.unitE === 'ng/dL') { //
          ratio = (answers.t / answers.e).toFixed(2);
          console.log({ ratio: ratio });

        } else if (answers.unitE === 'pmoL/L') { //

        }

      } else if (answers.unitT === 'pmoL/L') {
        if (answers.unitE === 'pmoL/L') {   //
          ratio = (answers.t / answers.e).toFixed(2);
          console.log({ ratio: ratio });

        } if (answers.unitE === 'ng/dL') { //
        }

      } else if (answers.unitT === 'nmol/L') {
        if (answers.unitE === 'pmoL/L') { //
          conversionT = (answers.t * 1000).toFixed(1);
          console.log({ conversionT: conversionT });
          ratio = (conversionT / answers.e).toFixed(2);
          console.log({ ratio: ratio });

        } if (answers.unitE === 'nmol/L') {   //
          ratio = (answers.t / answers.e).toFixed(2);
          console.log({ ratio: ratio });

        } if (answers.unitE === 'ng/dL') { //
        }
      }

      var result =
        '<ion-item mode="md" class="ion-text-center" color="plm-light" lines="none">' +
        '<ion-label class="white-space-ion-label">' +
        "Relación testosterona/estradiol = <b>" + ratio +
        "</b><br><br>La proporción entre la testosterona y el estradiol (T/E2) es un indicador fundamental de la salud sexual masculina. Para determinarla, se comparan las concentraciones de ambas hormonas: la testosterona, que se mide en nanogramos por decilitro (ng/dL); y el estradiol, que se mide en picogramos por mililitro (pg/mL). <br> Los valores considerados normales para la testosterona suelen oscilar entre 300 y 1000 ng/dL, mientras que para el estradiol, el rango normal es de 15 a 55 pg/mL. La evaluación de esta proporción es crucial para comprender la función endocrina masculina." +
        "</ion-label></ion-item>";
      return result;
    },

    bodyfai(answers) {
      console.warn("init bodyfai", answers);
      var fai = 0;
      //Total testosterone (nmol/ L) x 100 / Sex Hormone-Binding Globulin 
      fai = ((answers.t * 100) / answers.g).toFixed(2);
      console.log('fai', fai);

      var result =
        '<ion-item mode="md" class="ion-text-center" color="plm-light" lines="none">' +
        '<ion-label class="white-space-ion-label">' +
        "Índice de andrógenos libres (FAI):  <b>" + fai + '</b><br><br>' +
        "La testosterona circula en tres formas: unida a la SHBG, unida a la albúmina y de forma libre. Únicamente la testosterona libre (< 3% en hombres, < 0.7% en mujeres) puede ejercer efectos biológicos. <br><b>En mujeres</b>, la SHBG regula fuertemente la testosterona libre debido a su alta concentración. El exceso de testosterona reduce la SHBG, lo que eleva los niveles de testosterona libre. Los valores saludables típicos del FAI oscilan entre 7 a 10 en mujeres adultas. Los valores mayores a ese rango son motivo de preocupación que podrían contribuir al síndrome de ovario poliquístico y al hirsutismo.<br> <b>En los hombres</b>, los valores saludables típicos de FAI oscilan entre 30 y 150 en adultos. Los valores inferiores a 30 son motivo de preocupación y podrían contribuir a la disfunción eréctil. <br><b> El índice de andrógenos libres (FAI) como único cálculo no es un buen predictor por sí solo.</b>" +
        "</ion-label></ion-item>";
      return result;

    },


    bodyfsfi(answers) {
      console.warn("init bodyfsfi", answers);
      var sum = 0;
      var domain1 = 0, domain2 = 0, domain3 = 0, domain4 = 0, domain5 = 0, domain6 = 0;

      if (answers.q1 && answers.q2) {
        sum = answers.q1 + answers.q2;
        domain1 = (sum * 0.6).toFixed(2);
      }
      if (answers.q3 && answers.q4 && answers.q5 && answers.q6) {
        sum = answers.q3 + answers.q4 + answers.q5 + answers.q6;
        domain2 = (sum * 0.3).toFixed(1);
      }
      if (answers.q7 && answers.q8 && answers.q9 && answers.q10) {
        sum = answers.q7 + answers.q8 + answers.q9 + answers.q10;
        domain3 = (sum * 0.3).toFixed(1);
      }
      if (answers.q11 && answers.q12 && answers.q13) {
        sum = answers.q11 + answers.q12 + answers.q13;
        domain4 = (sum * 0.4).toFixed(1);
      }
      if (answers.q14 && answers.q15 && answers.q16) {
        sum = answers.q14 + answers.q15 + answers.q16;
        domain5 = (sum * 0.4).toFixed(1);
      }
      if (answers.q17 && answers.q18 && answers.q19) {
        sum = answers.q17 + answers.q18 + answers.q19;
        domain6 = (sum * 0.4).toFixed(1);
      }
      console.log('DOMAINS: ', domain1 + ' - ' + domain2 + ' - ' + domain3 + ' - ' + domain4 + ' - ' + domain5 + ' - ' + domain6);

      var domain = (Number(domain1) + Number(domain2) + Number(domain3) + Number(domain4) + Number(domain5) + Number(domain6)).toFixed(1);
      console.log('domain: ', domain);

      var result =
        '<ion-item mode="md" class="ion-text-center" color="plm-light" lines="none"><ion-label class="white-space-ion-label">' +
        "Use el resultado para evaluar la puntuación del índice de la función sexual femenina (FSFI). La puntuación máxima posible es de 36 puntos." +
        "<br><b>Puntaje = " + domain +
        "</b><br><br>Una puntuación total de 26.55 o menos se considera indicativa de disfunción sexual.  El FSFI se ha establecido como un estándar en la evaluación de diversas condiciones, incluidas la disfunción sexual femenina, vaginismo y deseo sexual hipoactivo, al tiempo que provee a los profesionales de la salud con una herramienta confiable para el diagnóstico y seguimiento de dichas afecciones." +
        "</ion-label></ion-item>";
      return result;
    },
    bodyICIQLUTSqol(answers) {
      console.warn("init bodyICIQLUTSqo", answers);
      var score = answers.q2a + answers.q3a + answers.q4a + answers.q5a + answers.q6a + answers.q7a + answers.q8a + answers.q9a + answers.q10a + answers.q11a + answers.q12a + answers.q13a + answers.q14a + answers.q15a + answers.q16a + answers.q17a + answers.q18a + answers.q19a + answers.q20a;
      var grade = answers.q21b;

      var result =
        '<ion-item mode="md" class="ion-text-center" color="plm-light" lines="none">' +
        '<ion-label class="white-space-ion-label">' +
        "Use el resultado para evaluar el impacto del tratamiento<br>" +
        "Puntaje:  <b>" + score + '</b> puntos' + '<br> ' +
        "Grado general de molestia:" + grade +
        "</ion-label>" +
        "</ion-item>";
      return result;
    },
    bodyCalculadoraDensidadAntigenoProstatico: function (answers) {
      console.warn('init bodyCalculadoraDensidadAntigenoProstatico');
      var varOptionLP = answers.longitudP;
      var varOptionANP = answers.anchoP;
      var varOptionALP = answers.alturaP;
      var varOptionPSA = answers.valorPSA;
      console.log('varOptionLP', varOptionLP, 'varOptionANP', varOptionANP, 'varOptionALP', varOptionALP, 'varOptionPSA', varOptionPSA)

      var volumenP = (varOptionLP * varOptionANP * varOptionALP * (Math.PI / 6)).toFixed(2);
      console.log('volumenP', volumenP);
      var densidadP = (varOptionPSA / volumenP).toFixed(2);
      console.log('densidadP', densidadP);

      var result = '<ion-item mode="md" class="ion-text-center" color="plm-light" lines="none">' +
        '<ion-label class="white-space-ion-label">' +
        '<b>' + 'Volumen prostático: ' + '</b>' + volumenP + 'cm<sup>3</sup>' + '<br>' +
        '<b>' + 'Densidad de PSA: ' + '</b>' + densidadP + 'ng/mL/cm<sup>3</sup>' + '</ion-label>' + '</ion-item> <br><p><b>Recomendaciones de abordaje diagnóstico:</b> <br>El incremento de la densidad del antígeno prostático específico (DAPE) se ha vinculado con el crecimiento de próstata en procesos neoplásicos de este órgano. <br>Se ha encontrado que pacientes debajo del rango 0.10 a 0.15 ng/mL/cc con un crecimiento prostático, pueden evitar de forma segura la realización de una biopsia. Dentro de ese rango se deberá considerar el abordaje diagnóstico de cáncer de próstata. <br>En pacientes con hiperplasia prostática benigna y una DAPE<0.05 ng/mL/cc, se ha encontrado un patrón glandular disminuido y menor respuesta a medicamentos 5-alfa reductasa. </p>';
      return result;
    },

    bodycalcVQS: function (answers) {
      console.warn('init bodycalcVQS', answers);
      var score1 = 0;
      var score2 = 0;
      var score3 = 0;
      var score4 = 0;
      var legend1 = '';
      var legend2 = '';
      var legend3 = '';
      var legend4 = '';
      var result = '';


      score1 = answers.q1 + answers.q2 + answers.q3 + answers.q4 + answers.q5 + answers.q6 + answers.q7;
      console.log('scoreSintomatología: ', score1);

      score2 = answers.q8 + answers.q9 + answers.q10 + answers.q11;
      console.log('scoreEmocional   ', score2);

      score3 = answers.q12 + answers.q13 + answers.q14 + answers.q15 + answers.q16;
      console.log('scoreVida  ', score3);

      if (answers.q17 === '0') {
        score4 = answers.q17;
        console.log('scoreSexual', score4);
      } else if (answers.q17 === '1') {
        score4 = answers.q17 + answers.q18 + answers.q19 + answers.q20 + answers.q21;
        console.log('scoreSexual', score4);
      }



      if (score1 === 0) {
        legend1 = 'Sin sintomatología vulvovaginal.';
      } else {
        legend1 = 'Presencia de sintomatología vulvovaginal.';
      }

      if (score2 === 0) {
        legend2 = 'Sin impacto en el componente emocional.';
      } else {
        legend2 = 'Con impacto en el componente emocional.';
      }

      if (score3 === 0) {
        legend3 = 'Sin impacto en la calidad de vida.';
      } else {
        legend3 = 'Con impacto en la calidad de vida.';
      }

      if (score4 === 0) {// 17 
        legend4 = 'Sin impacto en el componente sexual.';
      } else {
        legend4 = 'Con impacto en el componente sexual.';
      }


      var result = '<table  style="width: 100%; margin-right: auto; class="table" color="secondary">' +
        '<tr class="ion-text-center " color="secondary">' + '<th>' + 'Calificación obtenida por apartado' + '</th>' + '<th>' + 'Puntuación' + '</th>' + '<th>' + 'Interpretación del resultado' + '</tr>' +
        '<tr class="ion-text-center " >' + '<td>' + 'Sintomatología' + '</td>' + '<td>' + score1 + '</td>' + '<td>' + legend1 + '</td>' + '</tr>' +
        '<tr class="ion-text-center " >' + '<td>' + 'Impacto en el componente emocional ' + '</td>' + '<td>' + score2 + '</td>' + '<td>' + legend2 + '</td>' + '<td>' + '</tr>' +
        '<tr class="ion-text-center " >' + '<td>' + 'Impacto en la calidad de vida' + '</td>' + '<td>' + score3 + '</td>' + '<td>' + legend3 + '</td>' + '</tr>' +
        '<tr class="ion-text-center " >' + '<td>' + 'Impacto en el componente sexual' + '</td>' + '<td>' + score4 + '</td>' + '<td>' + legend4 + '</td>' + '<td>' + '</tr>' +
        '</table> ';

      return result;
    },
  }
})(calculatorBusinessLogicObject || {})