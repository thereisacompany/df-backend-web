import 'vxe-table/lib/style.css';
import '/@/design/table.scss';
import 'virtual:windi-base.css';
import 'virtual:windi-components.css';
import '/@/design/index.less';
import 'virtual:windi-utilities.css';
// Register icon sprite
import 'virtual:svg-icons-register';
import App from './App.vue';
import { createApp } from 'vue';
import { initAppConfigStore } from '/@/logics/initAppConfig';
import { setupErrorHandle } from '/@/logics/error-handle';
import { router, setupRouter } from '/@/router';
import { setupRouterGuard } from '/@/router/guard';
import { setupStore } from '/@/store';
import { setupGlobDirectives } from '/@/directives';
import { setupI18n } from '/@/locales/setupI18n';
import { registerGlobComp } from '/@/components/registerGlobComp';

//vxe-table
import 'xe-utils';
import { i18n } from '/@/locales/setupI18n';
import VXETable from 'vxe-table';

import { isArray } from './utils/is';

VXETable.setup({
  // 对组件内置的提示语进行国际化翻译
  i18n: (key, args) => {
    const name = 'vxeTable.' + key;

    if (args) {
      if (isArray(args)) {
        const model = {};
        model['num1'] = args[0];
        return i18n.global.t(name, model);
      } else {
        return i18n.global.t(name, args);
      }
    } else {
      return i18n.global.t(name);
    }
  },
});

async function bootstrap() {
  const app = createApp(App);

  app.use(VXETable);

  // Configure store
  setupStore(app);

  // Initialize internal system configuration
  initAppConfigStore();

  // Register global components
  registerGlobComp(app);

  // Multilingual configuration
  // Asynchronous case: language files may be obtained from the server side
  await setupI18n(app);

  // Configure routing
  setupRouter(app);

  // router-guard
  setupRouterGuard(router);

  // Register global directive
  setupGlobDirectives(app);

  // Configure global error handling
  setupErrorHandle(app);

  // https://next.router.vuejs.org/api/#isready
  // await router.isReady();

  app.mount('#app');
}

bootstrap();
