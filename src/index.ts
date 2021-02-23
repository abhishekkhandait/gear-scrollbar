import { LitElement, html, customElement, css, property, svg } from 'lit-element';
import ResizeObserver from 'resize-observer-polyfill';

@customElement('gear-scrollbar')
export class GearScrollbar extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      height: 100%;
      background: 'red';
      right: 0;
      top: 0;
      width: 50px;
      opacity: 0.5;
      transition: all 0.5s ease-out;
    }
    :host.active {
      right: 0px;
    }
  `;

  @property({ type: Number }) angle = 0;
  @property({ type: Number }) height = 0;

  public points: string[] = [];
  private scrollerHeight: number = 0;

  connectedCallback() {
    super.connectedCallback();
    if (this.parentElement) {
      this.resizeObserver().observe(this.parentElement);
      this.parentElement.onscroll = () => {
        this.angle = this.parentElement ? this.parentElement.scrollTop : 0;
      };
    }
  }

  public resizeObserver(): ResizeObserver {
    return new ResizeObserver((entries: any) => {
      entries.forEach((entry: any) => {
        this.scrollerHeight = entry.target.scrollHeight;
        console.log(entry.target.scrollHeight);
        this.render();
      });
    });
  }

  render() {
    const multiple = 36;
    for (let i = multiple; i < this.scrollHeight; i += multiple) {
      this.points.push(`${i}`);
    }
    return html`
      <div style="height: 100%; position: absolute">
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="${this.scrollerHeight}px"
          preserveAspectRatio="xMidYMid meet"
        >
          <clipPath id="myClip">
            <rect x="0" y="0" width="50px" height="100%" />
          </clipPath>
          <g style="clip-path: url(#myClip);">
            <g transform="translate(98, 90), scale(0.5, 0.5)">
              <g
                style="transform: translate(0, ${this.angle *
      2}px) rotate(${this.angle / 2}deg)"
                stroke="none"
              >
                <path
                  d="M146,16.7v-33.5L112.8-25c-1.6-7.3-3.9-14.3-6.8-21l22-26.2l-19.7-27.1L76.4-86.5     c-5.5-4.9-11.4-9.2-17.8-12.9l2.4-34.2L29.2-144l-18.1,29c-3.6-0.3-7.3-0.6-11.1-0.6c-3.7,0-7.4,0.2-11.1,0.6l-18.2-29L-61-133.7     l2.4,34.2c-6.3,3.8-12.3,8.1-17.8,12.9l-31.8-12.8l-19.6,27.1l22,26.2c-2.9,6.7-5.2,13.7-6.8,21l-33.2,8.3v33.5l33.2,8.3     c1.6,7.3,3.9,14.3,6.8,21l-22,26.2l19.7,27.1l31.8-12.8c5.5,4.9,11.4,9.2,17.8,13l-2.4,34.2l31.8,10.3l18.1-29     c3.6,0.3,7.3,0.6,11.1,0.6c3.7,0,7.4-0.2,11.1-0.6l18.1,29L61,133.7l-2.4-34.2c6.4-3.8,12.3-8.1,17.8-13l31.8,12.8l19.7-27.1     l-22-26.2c2.9-6.7,5.2-13.7,6.8-21L146,16.7z M0,73c-40.3,0-73-32.7-73-73c0-40.3,32.7-73,73-73c40.3,0,73,32.7,73,73     C73,40.3,40.3,73,0,73z"
                />
              </g>
            </g>
            <g style="transform:translate(0, 0 / 2}px)">
              ${this.points.map(
        (p) =>
          svg`<circle cx="30" r="4" cy="${p}" fill=#a1a1a1"></circle>`
      )}
            </g>
          </g>
        </svg>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gear-scrollbar': GearScrollbar;
  }
}
