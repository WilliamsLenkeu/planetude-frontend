import VConsole from 'vconsole';

let vConsoleInstance: VConsole | null = null;

export const devConsole = {
  init: () => {
    if (localStorage.getItem('dev_mode') === 'true' && !vConsoleInstance) {
      vConsoleInstance = new VConsole();
    }
  },
  toggle: (enable: boolean) => {
    if (enable) {
      if (!vConsoleInstance) {
        vConsoleInstance = new VConsole();
      }
      localStorage.setItem('dev_mode', 'true');
    } else {
      if (vConsoleInstance) {
        vConsoleInstance.destroy();
        vConsoleInstance = null;
      }
      localStorage.setItem('dev_mode', 'false');
    }
  },
  isEnabled: () => localStorage.getItem('dev_mode') === 'true'
};
