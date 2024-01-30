<!-- 個人資訊 -->
<template>
  <div class="user-block">
    <div class="user-block-list">
      <!-- head -->
      <div class="head">
        {{ getHeadName(info.friendName) }}
      </div>
      <div class="my-name">
        <div v-show="info.isEdit !== true">
          <label>{{ info.friendName }}</label>
          <Icon icon="bx:edit" @click="showNameInput" />
        </div>
        <div v-show="info.isEdit === true">
          <a-input
            ref="inputNameRef"
            show-count
            type="text"
            size="small"
            v-model:value="info.friendName"
            :maxlength="50"
            :style="{ width: '120px' }"
          />
          <Icon
            icon="ant-design:check-outlined"
            :size="17"
            class="px-1 pl-2 cursor-pointer"
            @click="updateName"
          />
          <Icon
            icon="ant-design:close-outlined"
            :size="17"
            class="cursor-pointer"
            @click="cancelName"
          />
        </div>
      </div>

      <!-- tags -->
      <div class="user-tags">
        <template v-for="tag in tagData.tags" :key="tag + index">
          <a-tag :closable="true" @close="handleTagRemove(tag)">
            {{ tag }}
          </a-tag>
        </template>
        <a-input
          show-count
          v-if="tagData.inputVisible"
          ref="inputTagRef"
          v-model:value="tagData.inputValue"
          type="text"
          size="small"
          :maxlength="10"
          :style="{ width: '78px' }"
          @blur="handleTagAdd"
          @keyup.enter="handleTagAdd"
        />
        <a-tag v-else class="add-tag" @click="showTagInput">+{{ t('common.add') }}</a-tag>
      </div>

      <!-- memo -->
      <Memo ref="memoRef" />
    </div>

    <div class="memo-add-btn">
      <a-button class="custom-btn-area-lightBlue custom-size-default mx-3" @click="openMemoModel">
        <Icon icon="carbon:add-filled" :size="14" />
        {{ t('component.chatRoom.AddMemo') }}
      </a-button>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick, reactive, ref } from 'vue';
  import { Tag, Input } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { showMsg } from '/@/utils/globalTips';
  // import dayjs from 'dayjs';

  import { getHeadName } from '/@/views/customerService/common';
  // import { updateTGFriends } from '/@/api/page/TGRobot/tgRobotApi';
  import Memo from './components/Memo/index.vue';
  export default defineComponent({
    components: {
      Memo,
      Icon,
      ATag: Tag,
      AInput: Input,
    },
    emits: ['update-info'],
    setup(_, { emit }) {
      const { t } = useI18n();
      /*=========values=========*/
      //info
      const inputNameRef = ref<any>(null);
      const info = reactive<any>({
        createAt: null,
        friendId: null,
        friendName: null,
        id: null,
        jobId: null,
        tgId: null,
        lastActTime: null,
        lastMsgTime: null,
      });
      const oldName = ref<any>(null);

      //tags
      const inputTagRef = ref<any>(null);
      const tagData = reactive<any>({
        tags: ['老客人', '態度優良'],
        inputVisible: false,
        inputValue: '',
      });

      //memo
      const memoRef = ref<any>(null);
      /*=========function=========*/
      //info
      function showNameInput() {
        info.isEdit = true;
        inputNameRef.value.focus();
      }
      async function updateName() {
        if (!info.friendName) {
          showMsg('warning', t('component.Bulletin.noContent'));
          return;
        }
        oldName.value = info.friendName;
        info.isEdit = false;

        // const modelFriend = {
        //   friendName: info.friendName,
        //   lastMsgTime: info.lastMsgTime
        //     ? dayjs(info.lastMsgTime).format('YYYY-MM-DD HH:mm:ss')
        //     : dayjs().format('YYYY-MM-DD HH:mm:ss'),
        //   lastActTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        // };

        // await updateTGFriends(info.id, modelFriend);
        showMsg('success', t('common.success'));

        //刷新暱稱
        const model = {
          createAt: info.createAt,
          friendId: info.friendId,
          friendName: info.friendName,
          id: info.id,
          jobId: info.jobId,
          tgId: info.tgId,
        };
        emit('update-info', model);
      }
      function cancelName() {
        info.friendName = oldName.value;
        info.isEdit = false;
      }
      //設定個人資料
      function setUserInfo(data) {
        info.id = data.id;
        info.createAt = data.createAt;
        info.friendId = data.friendId;
        info.friendName = data.friendName;
        info.jobId = data.jobId;
        info.tgId = data.tgId;
        info.lastActTime = data.lastActTime;
        info.lastMsgTime = data.lastMsgTime;
        info.isEdit = false;

        oldName.value = info.friendName;
      }

      //tags
      function showTagInput() {
        tagData.inputVisible = true;
        nextTick(() => {
          inputTagRef.value.focus();
        });
      }
      function handleTagRemove(removedTag: string) {
        const tags = tagData.tags.filter((tag) => tag !== removedTag);
        tagData.tags = tags;
      }
      function handleTagAdd() {
        const inputValue = tagData.inputValue;
        if (inputValue) {
          let tags = tagData.tags;
          if (inputValue && tags.indexOf(inputValue) === -1) {
            tags.push(inputValue);
          }
          Object.assign(tagData, { tags, inputVisible: false, inputValue: '' });
        } else {
          tagData.inputVisible = false;
        }
      }

      //memo
      function openMemoModel() {
        memoRef.value.handleMemoAdd();
      }

      /*=========data=========*/
      return {
        t,

        //head
        getHeadName,

        //info
        info,
        inputNameRef,
        showNameInput,
        updateName,
        cancelName,
        setUserInfo,

        //tags
        tagData,
        inputTagRef,
        showTagInput,
        handleTagRemove,
        handleTagAdd,

        //memo
        memoRef,
        openMemoModel,
      };
    },
  });
</script>
