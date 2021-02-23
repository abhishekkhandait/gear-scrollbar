const styles = `
    .gearscroll-div {
      position: absolute;
      right: -50px;
      top: 0;
      bottom: 0;
      width: 50px;
      opacity: 0.5;
      transition: all 0.5s ease-out;
    }
    .gearscroll-div.active {
      right: 0px;
    }
  `;

declare var ResizeObserver: {
    prototype: ResizeObserver;
    new(callback: ResizeObserverCallback): ResizeObserver;
};

interface options {
    autoHide?: boolean;
    autoHideTimeout?: number;
    gearTopOffset?: number;
    chainWidth?: number;
    scrollbars?: boolean;
    autoResize?: boolean;
}

export default class gearScroll {
    private container: HTMLElement;
    private angle = 0;
    private points: string[] = [];
    private scrollHeight: number = 0;
    private options: options;
    private scrollDiv: HTMLDivElement;
    private scrollListener: any;
    private timer = 0;
    private scrollShowTimer = 0;

    constructor(private selector: string | HTMLElement, options: options) {
        this.options = {
            autoHide: true,
            autoHideTimeout: 1000,
            gearTopOffset: 90,
            chainWidth: 3,
            scrollbars: false,
            ...options,
        }
        if (typeof selector === 'string') {
            this.container = document.querySelector(selector) as HTMLElement;
            if (!this.container) {
                console.error(`${selector} not found!!!`);
            }
        } else {
            this.container = selector;
        }
        this.scrollDiv = this.scrollDiv = document.createElement('div');
        this.scrollHeight = this.container.scrollHeight;
        this.calcChainPositions().createScrollbar().addScrollListener();
        this.resizeObserver().observe(this.container);
    }

    public refresh() {
        this.scrollHeight = this.container.scrollHeight;
        this.calcChainPositions().createScrollbar();
    }

    public destroy() {
        this.container.removeChild(this.scrollDiv);
    }

    private calcChainPositions() {
        this.points = [];
        const multiple = 36;
        for (let i = multiple; i < this.scrollHeight; i += multiple) {
            this.points.push(`${i}`);
        }
        return this;
    }

    private addScrollListener() {
        this.scrollListener = () => {
            const scrolldiv = this.container.querySelector('.gearscroll-div') as HTMLDivElement;
            scrolldiv.style.right = '0';
            window.clearTimeout(this.scrollShowTimer);
            this.angle = this.container.scrollTop;
            const gear = this.scrollDiv.querySelector('.gearscroll-gear') as SVGGElement;
            gear.style.transform = `translate(0, ${this.angle * 2}px) rotate(${this.angle}deg)`;
            this.scrollShowTimer = window.setTimeout(() => {
                this.options.autoHide && (scrolldiv.style.right = '-50px')
            }, this.options.autoHideTimeout)

        };
        this.container.onscroll = this.scrollListener;
    }

    private createScrollbar() {
        let scrollStyle = '';
        if (this.options.scrollbars === false) {
            scrollStyle = `${this.selector}::-webkit-scrollbar { display: none}`;
            // this.container.appendChild(style);
        }
        this.scrollDiv.innerHTML =
            `<style>${styles} ${scrollStyle}</style>
            <div class="gearscroll-div">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="100%" height="${this.scrollHeight}px" preserveAspectRatio="xMidYMid meet">
                    <clipPath id="myClip">
                        <rect x="0" y="0" width="50px" height="100%" />
                    </clipPath>
                    <g style="clip-path: url(#myClip);">
                        <g transform="translate(98, ${this.options.gearTopOffset}), scale(0.5, 0.5)">
                            <g class="gearscroll-gear" style="transform: translate(0, ${this.angle * 2}px) rotate(${this.angle}deg)" stroke="none">
                                <path d="M146,16.7v-33.5L112.8-25c-1.6-7.3-3.9-14.3-6.8-21l22-26.2l-19.7-27.1L76.4-86.5  c-5.5-4.9-11.4-9.2-17.8-12.9l2.4-34.2L29.2-144l-18.1,29c-3.6-0.3-7.3-0.6-11.1-0.6c-3.7,0-7.4,0.2-11.1,0.6l-18.2-29L-61-133.7 l2.4,34.2c-6.3,3.8-12.3,8.1-17.8,12.9l-31.8-12.8l-19.6,27.1l22,26.2c-2.9,6.7-5.2,13.7-6.8,21l-33.2,8.3v33.5l33.2,8.3 c1.6,7.3,3.9,14.3,6.8,21l-22,26.2l19.7,27.1l31.8-12.8c5.5,4.9,11.4,9.2,17.8,13l-2.4,34.2l31.8,10.3l18.1-29 c3.6,0.3,7.3,0.6,11.1,0.6c3.7,0,7.4-0.2,11.1-0.6l18.1,29L61,133.7l-2.4-34.2c6.4-3.8,12.3-8.1,17.8-13l31.8,12.8l19.7-27.1 l-22-26.2c2.9-6.7,5.2-13.7,6.8-21L146,16.7z M0,73c-40.3,0-73-32.7-73-73c0-40.3,32.7-73,73-73c40.3,0,73,32.7,73,73,C73,40.3,40.3,73,0,73z"/>
                            </g>
                        </g>
                        <g style="transform:translate(0, 0 / 2}px)">
                            ${this.points.map((p) => `<circle cx="30" r="${this.options.chainWidth}" cy="${p}" fill=#a1a1a1"></circle>`).join('')}
                        </g>
                    </g>
                </svg>
            </div>`;
        this.container.appendChild(this.scrollDiv);
        return this;
    }

    public resizeObserver(): ResizeObserver {
        return new ResizeObserver(() => {
            this.scrollDiv.style.display = 'none';
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = window.setTimeout(() => {
                this.scrollHeight = this.container.scrollHeight;
                this.refresh();
                this.scrollDiv.style.display = 'block';
            }, 1000);
        });
    }
}