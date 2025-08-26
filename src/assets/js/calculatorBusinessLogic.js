var calculatorBusinessLogicObject = (function () {
  return {
    testGreetingEnglish: function (name) {
      console.warn('Init greetingEnglish from calculatorBusinessLogicObject external js');
      console.warn('hello: ', name);
    },

    getCalculatorResult: function (PLMCalculatorSolutionMethodId, answers) {
      switch (PLMCalculatorSolutionMethodId) {

        case 'calcTrackingMenstrualCicle':
          console.warn('solución Encontrada ejecutando... calcTrackingMenstrualCicle');
          return this.bodycalcTrackingMenstrualCicle(answers);
        case 'calcVQS':
          console.warn('solución Encontrada ejecutando... calcVQS');
          return this.bodycalcVQS(answers);
        case 'riskFractureWomen':
          console.warn('solución Encontrada ejecutando... riskFractureWomen');
          return this.bodyRiskFractureWomen(answers);

        default:
          throw new Error('No se encontro solución a la calculadora.');
      }
    },

    bodycalcTrackingMenstrualCicle: function (answers) {
      console.error("init bodycalcTrackingMenstrualCicle", answers);
      var period = answers.p;
      var day = answers.day;
      var circle = answers.circle;
      var result = "";
      let arrayDate = period.split("/");
      console.log('period', period + '/ ' + day + '/ ' + circle);

      console.log(" Periodo-posicion Dia ", arrayDate[0].length);
      console.log(" Periodo-Posicion Mes ", arrayDate[1].length);
      console.log(" Periodo-Posicion Año ", arrayDate[2].length);

      if (arrayDate.length > 2) {
        if (arrayDate[1].length === 1) {
          console.warn(" 1 Digito MONTH", arrayDate[1].length);
          //GET DATE 1
          if (arrayDate[0].length === 1) {
            var date =
              arrayDate[2] + "-" + 0 + arrayDate[1] + "-" + 0 + arrayDate[0]; // add 0 to day
          } else {
            var date =
              arrayDate[2] + "-" + 0 + arrayDate[1] + "-" + arrayDate[0];
          }
          console.log('date', date);

          const sum = new Date(`${date}T00:00:00`); // for no rest one day
          sum.setDate(sum.getDate() + parseInt(circle)); // sum
          console.log('period + circle', sum);
          var date1 = sum.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
          console.log('fecha1', date1);


          //**** CHECAR:  coloca un mes menos  y aveces incremenra en 1 el día
          // GET DATE 2
          console.log('DATE 2');
          console.log({ sum: sum });
          var srtDate = sum.getDate() + '/' + (sum.getMonth() + 1) + '/' + sum.getFullYear();
          console.log({ srtDate: srtDate });


          let arrayDate2 = srtDate.split("/");
          if (arrayDate2[0].length === 1) {
            console.log('AGREGA 0');
            var date2 =
              arrayDate2[2] + "-" + 0 + arrayDate2[1] + "-" + 0 + arrayDate2[0]; // add 0 to day
          } else {
            console.log('NADA');
            var date2 =
              arrayDate2[2] + "-" + 0 + arrayDate2[1] + "-" + arrayDate2[0];
          }
          console.log('date2', date2);

          const sumDate2 = new Date(`${date2}T00:00:00`); // for no rest month
          console.log('sum2', sumDate2);
          //se resta 1, porque el conteo inicia justo el dia que se sumó el ciclo
          sumDate2.setDate(sumDate2.getDate() + parseInt(day - 1)); // sum por que el conteo inicica justo cuando termina el
          console.log('sum + day', sumDate2);
          var date2 = sumDate2.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
          console.log('fecha2', date2);


          result = '<p  class="ion-text-center">' + 'Las fechas estimadas de su periodo son: <br><b>' + date1 + ' al ' + date2 + '</b> </p>';
        }
      }

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
        '</table>';

      return result;
    },

    bodyRiskFractureWomen: function (answers) {
      console.warn('init bodyRiskFractureWomen', answers);
      var score = 0;
      var legend = '';
      var result = '';

      if (answers.q7) { // DMO
        score = answers.q1 + answers.q2 + answers.q3 + answers.q4 + answers.q5 + answers.q6 + answers.q7;

        console.log('score con DMO', score);

        if (score === 0) {
          legend = '<0.4%';
        } else if (score >= 1 && score <= 2) {
          legend = '0.4%';
        } else if (score >= 3 && score <= 4) {
          legend = '0.9%';
        } else if (score === 5) {
          legend = '1.9%';
        } else if (score >= 6 && score <= 7) {
          legend = '3.9%';
        } else if (score >= 8) {
          legend = '8.7%';
        }

      } else { //  sin de DMO

        score = answers.q1 + answers.q2 + answers.q3 + answers.q4 + answers.q5 + answers.q6;
        console.log('score  sin de DMO', score);

        if (score === 0) {
          legend = '<0.6%';
        } else if (score === 1) {
          legend = '0.6%';
        } else if (score === 2) {
          legend = '1.4%';
        } else if (score === 3) {
          legend = '2.1%';
        } else if (score === 4) {
          legend = '3.2%';
        } else if (score >= 5) {
          legend = '8.2%';
        }
      }

      result = '<ion-item mode="md" class="ion-text-center"  lines="none">' + '<ion-label>' + score + '  puntos. </b><br> Riesgo de fractura de cadera a 5 años del <b>' + legend + '</b></ion-label>' + '</ion-item>';

      return result;
    },

  }
})(calculatorBusinessLogicObject || {})