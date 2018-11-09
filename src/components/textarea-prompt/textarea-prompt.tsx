import React from 'react';
import ReactDOM from 'react-dom';
import { Modal, TextareaItem } from 'antd-mobile';
import closest from './closest';

export interface Action<T> {
  text: string;
  onPress?: () => void | Promise<any>;
  style?: T | string;
}

export type Callback = (valueOrLogin: string, password?: string) => void;
export type CallbackOrActions<T> = Callback | Action<T>[];

/**
 * textareaPrompt
 * @param {*} title title
 * @param {*} message message
 * @param {*} callbackOrActions callbackOrActions
 * @param {*} defaultValue defaultValue
 * @param {*} placeholders placeholders
 * @param {*} platform platform
 * @returns {*} any
 */
export default function textareaPrompt(
  title: React.ReactNode,
  message: React.ReactNode,
  callbackOrActions: CallbackOrActions<React.CSSProperties>,
  defaultValue = '',
  placeholders = ['', ''],
  platform = 'ios'
): any {
  let closed = false;

  defaultValue =
    typeof defaultValue === 'string'
      ? defaultValue
      : typeof defaultValue === 'number'
        ? `${defaultValue}`
        : '';

  if (!callbackOrActions) {
    return {
      close: () => {},
    };
  }

  const prefixCls = 'am-modal';

  const data: any = {
    text: defaultValue,
  };

  /**
   * onChange
   * @param {string} value value
   * @returns {*} any
   */
  function onChange(value: string): any {
    data['text'] = value;
  }

  const focusFn = (input: HTMLTextAreaElement | null): any => {
    setTimeout(() => {
      if (input) {
        input.focus();
      }
    }, 500);
  };

  const content = (
    <div>
      {message}
      <div className={`${prefixCls}-input-container`}>
        <TextareaItem
          defaultValue={data.text}
          ref={input => focusFn(input)}
          onChange={onChange}
          placeholder={placeholders[0]}
          autoHeight
        />
      </div>
    </div>
  );
  const div = document.createElement('div');
  document.body.appendChild(div);
  /**
   * close
   * @returns {*} any
   */
  function close(): any {
    ReactDOM.unmountComponentAtNode(div);
    if (div && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }
  /**
   * handleConfirm
   * @param {*} callback callback
   * @returns {*} any
   */
  function handleConfirm(callback?: (...args: any[]) => void): any {
    if (typeof callback !== 'function') {
      return;
    }
    const { text = '' } = data;
    const callbackArgs = [text];

    return callback(...callbackArgs);
  }
  let actions;
  if (typeof callbackOrActions === 'function') {
    actions = [
      {
        text: '取消',
        onPress: () => {},
      },
      {
        text: '确定',
        onPress: () => {
          handleConfirm(callbackOrActions);
        },
      },
    ];
  } else {
    actions = callbackOrActions.map(item => {
      return {
        text: item.text,
        onPress: () => {
          return handleConfirm(item.onPress);
        },
      };
    });
  }
  const footer = actions.map(button => {
    // tslint:disable-next-line:only-arrow-functions
    const orginPress = button.onPress || function() {};
    button.onPress = () => {
      if (closed) {
        return;
      }
      const res: any = orginPress();
      if (res && res.then) {
        res
          .then(() => {
            closed = true;
            close();
          })
          .catch(() => {});
      } else {
        closed = true;
        close();
      }
    };

    return button;
  });
  /**
   * onWrapTouchStart
   * @param {*} e event
   * @returns {*} any
   */
  function onWrapTouchStart(e: React.TouchEvent<HTMLDivElement>): any {
    // exclude input element for focus
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const target: any = e.target;
    const pNode = closest(target, `.${prefixCls}-content`);
    if (!pNode) {
      e.preventDefault();
    }
  }
  ReactDOM.render(
    <Modal
      visible
      transparent
      prefixCls={prefixCls}
      title={title}
      closable={false}
      maskClosable={false}
      transitionName="am-zoom"
      footer={footer}
      maskTransitionName="am-fade"
      platform={platform}
      wrapProps={{ onTouchStart: onWrapTouchStart }}
    >
      <div className={`${prefixCls}-propmt-content`}>{content}</div>
    </Modal>,
    div
  );

  return {
    close,
  };
}
