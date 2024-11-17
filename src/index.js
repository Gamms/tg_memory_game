import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initMainButton, initMiniApp,  initUtils,  mockTelegramEnv, parseInitData} from '@telegram-apps/sdk';
import { TwaAnalyticsProvider } from '@tonsolutions/telemetree-react';

const initializeTelegramSDK = async () => {
  try {
    // Попытка инициализировать настоящее окружение Telegram
    console.log("Инициализация окружения Telegram");
    const [miniApp] = initMiniApp();
    await miniApp.ready();
    miniApp.setHeaderColor('#fcb69f');

  } catch (error) {
    // В случае ошибки инициализируем фейковое окружение
    console.error('Ошибка при инициализации Telegram:', error);

    const initDataRaw = new URLSearchParams([
      ['user', JSON.stringify({
        id: 99281932,
        first_name: 'Andrew',
        last_name: 'Rogue',
        username: 'rogue',
        language_code: 'en',
        is_premium: true,
        allows_write_to_pm: true,
      })],
      ['hash', '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31'],
      ['auth_date', '1716922846'],
      ['start_param', 'debug'],
      ['chat_type', 'sender'],
      ['chat_instance', '8428209589180549439'],
    ]).toString();

    mockTelegramEnv({
      themeParams: {
        accentTextColor: '#6ab2f2',
        bgColor: '#17212b',
        buttonColor: '#5288c1',
        buttonTextColor: '#ffffff',
        destructiveTextColor: '#ec3942',
        headerBgColor: '#fcb69f',
        hintColor: '#708499',
        linkColor: '#6ab3f3',
        secondaryBgColor: '#232e3c',
        sectionBgColor: '#17212b',
        sectionHeaderTextColor: '#6ab3f3',
        subtitleTextColor: '#708499',
        textColor: '#f5f5f5',
      },
      initData: parseInitData(initDataRaw),
      initDataRaw,
      version: '7.2',
      platform: 'tdesktop',
    });

    console.log('Mock Telegram environment initialized');
  }
};

// Инициализация SDK
initializeTelegramSDK();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <TwaAnalyticsProvider
      projectId='d8a25ded-bbb2-4127-add1-a58be38c4cba'
      apiKey='0079639d-c877-4687-ba32-f515a506b964'
      appName='Memory Game'
    >
      <App />
    </TwaAnalyticsProvider>
  </React.StrictMode>
);

// Инициализация главной кнопки
const [mainButtonB] = initMainButton;
mainButtonB.setParams({
  backgroundColor: '#aa1388',
  text: 'Поделиться очками',
  isVisible: true,
  isEnabled: true,
});
mainButtonB.show();

const utilsB = initUtils();

// Установка обработчика нажатия на главную кнопку
mainButtonB.on('click', () => {
  try {
    // Получение текущих очков из localStorage
    const score = localStorage.getItem('memory-game-score') || 0;
    utilsB.shareURL(`Посмотрите! У меня ${score} очков в игре!`);
    console.log('Окно выбора чата открыто для отправки сообщения.');
  } catch (error) {
    console.error('Ошибка при открытии окна выбора чата:', error);
  }
});