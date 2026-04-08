import { getWorkout } from '../../common/program';

Page({
  state: {
    workout: null,
    currentExIdx: 0,
    currentSetIdx: 0,
    timer: null,
    timeLeft: 0,
    timerText: null
  },

  build() {
    const { volume } = getWorkout(new Date());
    this.state.workout = volume;
    this.state.exercises = Object.keys(volume);
    this.render();
  },

  render() {
    hmUI.clear();
    const exKey = this.state.exercises[this.state.currentExIdx];
    const reps = this.state.workout[exKey][this.state.currentSetIdx];
    const labels = { pu: 'Отжимания', sq: 'Приседания', plups: 'Подтягивания', pl: 'Планка' };

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0, y: 30, w: 192, h: 30, color: 0xff4757,
      text_size: 14, align_h: hmUI.align.CENTER_H,
      text: '⚠️ Михаил, ОСТОРОЖНО!'
    });

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0, y: 60, w: 192, h: 40, color: 0x8e2de2,
      text_size: 20, align_h: hmUI.align.CENTER_H,
      text: labels[exKey]
    });

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0, y: 100, w: 192, h: 80, color: 0xffffff,
      text_size: 64, align_h: hmUI.align.CENTER_H,
      text: reps
    });

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0, y: 180, w: 192, h: 30, color: 0xaaaaaa,
      text_size: 16, align_h: hmUI.align.CENTER_H,
      text: 'Сет ' + (this.state.currentSetIdx + 1) + ' из ' + this.state.workout[exKey].length
    });

    // Done Button
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 26, y: 250, w: 140, h: 60, radius: 30,
      normal_color: 0x00f2fe, press_color: 0x4facfe,
      text: 'ГОТОВО',
      click_func: () => {
        this.nextSet();
      }
    });

    // Skip Button
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 26, y: 320, w: 140, h: 60, radius: 30,
      normal_color: 0x333333, press_color: 0x111111,
      text: 'ПРОПУСТИТЬ',
      click_func: () => {
        this.nextSet(true);
      }
    });
  },

  nextSet(skip = false) {
    const exKey = this.state.exercises[this.state.currentExIdx];
    this.state.currentSetIdx++;

    if (this.state.currentSetIdx >= this.state.workout[exKey].length) {
      this.state.currentSetIdx = 0;
      this.state.currentExIdx++;
    }

    if (this.state.currentExIdx >= this.state.exercises.length) {
      this.finish();
    } else {
      if (!skip) this.startRest();
      else this.render();
    }
  },

  startRest() {
    hmUI.clear();
    this.state.timeLeft = 60;
    
    this.state.timerText = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0, y: 150, w: 192, h: 100, color: 0x00f2fe,
      text_size: 48, align_h: hmUI.align.CENTER_H,
      text: '60'
    });

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0, y: 80, w: 192, h: 40, color: 0xffffff,
      text_size: 20, align_h: hmUI.align.CENTER_H,
      text: 'ОТДЫХ'
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 26, y: 300, w: 140, h: 50, radius: 25,
      normal_color: 0x333333, text: 'Пропустить',
      click_func: () => { this.stopTimer(); this.render(); }
    });

    this.state.timer = timer.createTimer(0, 1000, () => {
      this.state.timeLeft--;
      this.state.timerText.setProperty(hmUI.prop.TEXT, this.state.timeLeft);
      
      if (this.state.timeLeft <= 0) {
        this.stopTimer();
        this.vibrate();
        this.render();
      }
    });
  },

  stopTimer() {
    if (this.state.timer) {
      timer.stopTimer(this.state.timer);
      this.state.timer = null;
    }
  },

  vibrate() {
    const vibrator = hmSensor.createSensor(hmSensor.id.VIBRATE);
    vibrator.stop();
    vibrator.scene = 25; // Standard scene
    vibrator.start();
  },

  finish() {
    hmUI.clear();
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0, y: 180, w: 192, h: 100, color: 0x00ff00,
      text_size: 24, align_h: hmUI.align.CENTER_H,
      text: 'ГОТОВО! 🎉\nВы молодец!'
    });
    
    timer.createTimer(3000, 0, () => {
      hmApp.goBack();
    });
  }
});
