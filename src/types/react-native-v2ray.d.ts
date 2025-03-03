declare module 'react-native-v2ray' {
  export default {
    start: (config: string) => Promise<void>,
    stop: () => Promise<void>,
    isRunning: () => Promise<boolean>,
    getStatistics: () => Promise<any>,
    setConfig: (config: string) => Promise<void>,
  };
}
