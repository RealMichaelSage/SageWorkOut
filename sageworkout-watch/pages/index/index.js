import { getWorkout } from '../../common/program';

Page({
  build() {
    const { type, volume, monthName } = getWorkout(new Date());
    
    // Header
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 40,
      w: 192,
      h: 50,
      color: 0x00f2fe,
      text_size: 24,
      align_h: hmUI.align.CENTER_H,
      text: monthName + ' 2026'
    });

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 90,
      w: 192,
      h: 30,
      color: 0xffffff,
      text_size: 18,
      align_h: hmUI.align.CENTER_H,
      text: type === 'Rest' ? 'Отдых' : (type === 'Volume' ? 'Объем' : 'Техника')
    });

    if (type === 'Rest') {
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 10,
        y: 200,
        w: 172,
        h: 100,
        color: 0xaaaaaa,
        text_size: 16,
        align_h: hmUI.align.CENTER_H,
        text: 'Время заслуженного отдыха! 🛋️'
      });
    } else {
      let yPos = 140;
      const labels = { pu: 'Отжимания', sq: 'Приседания', plups: 'Подтягивания', pl: 'Планка' };
      
      for (let k in volume) {
        hmUI.createWidget(hmUI.widget.TEXT, {
          x: 10,
          y: yPos,
          w: 172,
          h: 40,
          color: 0x8e2de2,
          text_size: 16,
          text: labels[k] + ': ' + volume[k].length + ' сетов'
        });
        yPos += 30;
      }

      hmUI.createWidget(hmUI.widget.BUTTON, {
        x: 26,
        y: 380,
        w: 140,
        h: 50,
        radius: 25,
        normal_color: 0x8e2de2,
        press_color: 0x4a00e0,
        text: 'Начать',
        click_func: () => {
          hmApp.gotoPage({ url: 'pages/workout/workout' });
        }
      });
    }
  }
});
