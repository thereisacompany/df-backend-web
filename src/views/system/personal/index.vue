<template>
  <PageWrapper :fixSmallWidth="true">
    <ScrollContainer>
      <div ref="wrapperRef" :class="prefixCls">
        <Collapse class="custom-collapse custom-collapse-space" v-model:activeKey="activeKey" ghost>
          <template v-for="item in settingList" :key="item.key">
            <CollapsePanel class="collapse-body" :forceRender="true">
              <template #header>
                <div class="collapse-header">
                  <p class="font-bold">{{ item.name }} </p>
                </div>
              </template>
              <component :is="item.component" />
            </CollapsePanel>
          </template>
        </Collapse>
      </div>
    </ScrollContainer>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Tabs, Collapse, CollapsePanel } from 'ant-design-vue';

  import { ScrollContainer } from '/@/components/Container/index';
  import { PageWrapper } from '/@/components/Page';
  import { settingList } from './data';
  import { useRoute } from 'vue-router';
  import { useAppStore } from '/@/store/modules/app';

  import SecureSetting from './SecureSetting.vue';
  import MsgNotify from './MsgNotify.vue';

  export default defineComponent({
    components: {
      PageWrapper,
      ScrollContainer,
      Tabs,
      TabPane: Tabs.TabPane,
      SecureSetting,
      MsgNotify,
      CollapsePanel,
      Collapse,
    },
    setup() {
      const route = useRoute();
      const routeTabKey = ref(String(route.query.key));

      const activeKey = ref('2');

      if (routeTabKey.value !== 'undefined') {
        activeKey.value = routeTabKey.value;
      }

      //---*裝置螢幕大小
      const deviceType = useAppStore().getDeviceType;

      return {
        prefixCls: 'account-setting',
        settingList,
        tabBarStyle: {
          width: '220px',
        },
        tabBarStyle2: {
          width: '100%',
          height: '48px',
        },
        activeKey,
        deviceType,
      };
    },
  });
</script>
<style lang="less">
  .account-setting {
    margin: 12px;

    .base-title {
      padding-left: 0;
    }

    .ant-tabs-tab-active {
      background-color: @item-active-bg;
    }

    .ant-tabs-tab {
      padding: 0 20px;
    }
  }
</style>
