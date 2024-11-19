export interface AudioListEvents {
  /**
   * 播放模式变化事件
   */
  modeChage: CustomEvent<PLAYMODETYPE>;
  setPlayerList: CustomEvent<IplayerList[]>;
  videoListTimeupdate: CustomEvent<{
    progress: string;
    type: string;
    formatDuration: string;
    formatCurrentTime: string;
    duration: number;
    currentTime: number;
  }>;

  switchSongs: CustomEvent<{
    info: IplayerList;
    currentIndex: number;
  }>;
}

type AudioListEventMap = HTMLMediaElementEventMap & AudioListEvents;

export enum PLAYMODEENUM {
  /**
   * 循环播放
   */
  LOOP = "loop",
  /**
   * 单曲循环
   */
  SINGLE = "single",
  /**
   * 顺序播放
   */
  ORDER = "order",
  /**
   *  随机播放
   */
  RANDOM = "random",
}

export type PLAYMODETYPE = "loop" | "single" | "order" | "random";

/**
 * 播放器列表
 */
export interface IplayerList {
  /**
   * 播放链接
   */
  src: string;
  /**
   * 曲目名称
   */
  title: string;
  /**
   * 序号
   */
  serial: number;
  /**
   * 其它扩展字段
   */
  [propsName: string]: any;
}

export interface CreateAudioMethodsParams {
  playerList: IplayerList[];
}
function getNestedValue(obj: any, path: string) {
  return path.split(".").reduce((current, key) => current && current[key], obj);
}
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * 格式化秒数为 HH:mm:ss
 * @param duration
 * @returns
 */
function formatDuration(duration: number) {
  const hours = Math.floor(duration / 3600); // 计算小时数
  const minutes = Math.floor((duration - hours * 3600) / 60); // 计算分钟数
  const seconds = Math.floor(duration - hours * 3600 - minutes * 60); // 计算秒数

  // 用两位数表示小时、分钟和秒，不足两位时前面补0
  const hoursStr = hours < 10 ? "0" + hours : hours;
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  const secondsStr = seconds < 10 ? "0" + seconds : seconds;

  return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

const CreateSymbol = Symbol("create");
class AudioList extends Audio {
  addEventListener<K extends keyof AudioListEventMap>(
    type: K,
    listener: (this: AudioList, ev: AudioListEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void {
    super.addEventListener(type, listener as any, options);
  }

  removeEventListener<K extends keyof AudioListEventMap>(
    type: K,
    listener: (this: AudioList, ev: AudioListEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void {
    super.removeEventListener(type, listener as any, options);
  }
  /**
   * 播放模式
   */
  public _mode: PLAYMODETYPE = PLAYMODEENUM.SINGLE;

  get mode() {
    return this._mode;
  }

  set mode(mode: PLAYMODETYPE) {
    this.changeMode(mode);
  }
  static modes: PLAYMODETYPE[] = ["single", "order", "random", "loop"];
  /**
   * 变化播放模式
   * @param mode
   */
  changeMode(mode?: PLAYMODETYPE) {
    if (mode) {
      this._mode = mode;
    } else {
      const index = AudioList.modes.findIndex((m) => m === this.mode);
      const resIndex = (index + 1) % AudioList.modes.length;
      this._mode = AudioList.modes[resIndex];
    }
    this.triggerChangeMode();
  }

  triggerChangeMode() {
    this.dispatchEvent(new CustomEvent("modeChage", { detail: this._mode }));
  }

  /**
   * 当前播放的索引
   */
  private _currentIndex: number = 0;
  set currentIndex(index: number) {
    const isPlaying = !this.paused;
    const currentSrc = this.playerList[index].src;
    if (this.src === currentSrc) {
      return;
    }
    this.src = this.playerList[index].src;
    this._currentIndex = index;
    if (isPlaying) {
      this.play();
    }
  }
  get currentIndex() {
    return this._currentIndex;
  }

  get currentPlayerInfo() {
    return this.playerList[this.currentIndex];
  }
  /**
   * 播放器列表
   */
  public playerList: CreateAudioMethodsParams["playerList"] = [];
  private constructor(creator?: Symbol) {
    if (creator !== CreateSymbol) {
      throw new Error("请使用 create 静态方法创建实例！");
    }
    super();
  }
  static audioList: AudioList;
  /**
   * 创建播放器
   * @returns
   */
  public static create() {
    if (!AudioList.audioList) {
      const audio = new AudioList(CreateSymbol);
      AudioList.audioList = audio;
      audio.init();
    }
    return AudioList.audioList;
  }
  /**
   * 设置播放列表
   * @param playerList
   * @param index 设置要播放的索引 默认是 0
   */
  setPlayerList(
    playerList: CreateAudioMethodsParams["playerList"],
    index: number = 0
  ) {
    this.playerList = playerList;
    this.currentIndex = index;

    const event = new CustomEvent("setPlayerList", { detail: playerList });
    this.dispatchEvent(event);
  }
  /**
   * 获取当前播放列表
   * @returns
   */
  getPlayerList() {
    return this.playerList;
  }
  /**
   * 上一首播放
   */
  prev(isPlay?: boolean) {
    const nextIndex = this.currentIndex - 1;
    if (nextIndex < 0) {
      const len = this.playerList.length;
      this.currentIndex = len - 1;
    } else {
      this.currentIndex = nextIndex;
    }

    if (isPlay) {
      this.play();
    }
    return this.currentPlayerInfo;
  }
  /**
   * 下一首
   */
  next(isPlay?: boolean) {
    const len = this.playerList.length;
    const nextIndex = this.currentIndex + 1;
    if (nextIndex === len) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = nextIndex;
    }

    if (isPlay) {
      this.play();
    }
    return this.currentPlayerInfo;
  }
  randomPlay(isPlay?: boolean) {
    const len = this.playerList.length;
    const nextIndex = getRandomInt(0, len - 1);
    this.currentIndex = nextIndex;
    if (isPlay) {
      this.play();
    }

    return this.currentPlayerInfo;
  }
  init() {
    this.addEventListener("ended", this.onEnded.bind(this));
    this.addEventListener("timeupdate", this.onCustomTimeupdate.bind(this));
    document.addEventListener(
      "visibilitychange",
      this.onVisibilityChange.bind(this)
    );
    this.addEventListener("error", this.onError.bind(this));
  }
  /**
   * 播放完成事件
   * @param event
   */
  private onEnded() {
    let info = this.currentPlayerInfo;
    switch (this.mode) {
      case PLAYMODEENUM.LOOP:
        info = this.next(true);
        break;
      case PLAYMODEENUM.SINGLE:
        this.play();
        break;
      case PLAYMODEENUM.ORDER:
        if (this.playerList.length - 1 === this.currentIndex) return;
        info = this.next(true);
        break;
      case PLAYMODEENUM.RANDOM:
        info = this.randomPlay(true);
        break;
    }
    this.dispatchEvent(
      new CustomEvent("switchSongs", {
        detail: { info, currentIndex: this.currentIndex },
      })
    );
  }
  private onCustomTimeupdate() {
    const event = new CustomEvent("videoListTimeupdate", {
      detail: {
        progress: this.progress,
        type: "videoListTimeupdate",
        formatDuration: formatDuration(this.duration || 0),
        formatCurrentTime: formatDuration(this.currentTime || 0),
        duration: this.duration,
        currentTime: this.currentIndex,
      },
    });
    this.dispatchEvent(event);
  }

  /**
   * 播放进度百分比
   */
  get progress() {
    return this.duration
      ? Math.floor((this.currentTime / this.duration) * 100)
      : 0;
  }
  set progress(pro: number) {
    const durcation = this.duration;
    if (durcation) {
      this.currentTime = (pro / 100) * durcation;
    }
  }
  /**
   * 将不符合 IplayerList 接口规则的对象，转换成符合接口规则的对象。
   * @param item 原始对象
   * @param transformMap 要映身的字段
   * @returns
   * @example
   * AudioList.transformPlayerList(item, {
                  title: "mulu",
                  src: "dmtUrl.adUrl",
                  serial: "xuhao",
                })
   * 
   * 
   */
  static transformPlayerList(item: any, transformMap: IplayerList) {
    let obj: any = {};
    for (let key in transformMap) {
      obj[key] = getNestedValue(item, transformMap[key]);
    }
    return Object.assign(item, obj);
  }

  onVisibilityChange() {
    console.log(document.hidden);
  }

  onError() {
    console.log("播放失败", document.hidden);
    if (document.hidden) {
      this.onEnded();
    }
  }
}

export default AudioList;
