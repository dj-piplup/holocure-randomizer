import { LitElement, css, html, nothing } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { talents } from './talents';
import { upgradeEnabled } from './upgrade';

@customElement('holocure-main-content')
export class HolocureMainContent extends LitElement {

  @state() selected:number = -1;
  @state() enabled:boolean[] = new Array(talents.length).fill(true);

  roll(){
    let enabledIndices:number[] = [];
    this.enabled.forEach((t, idx) => {
      if(t) enabledIndices.push(idx);
    });
    if(enabledIndices.length === 0){
      this.selected = -1;
      return;
    }
    const roll = Math.floor(Math.random() * enabledIndices.length);
    this.selected = enabledIndices[roll];
  }
  
  handleToggle({detail:{idx, available}}:DocumentEventMap['holocure-talent-toggle']){
    this.enabled = this.enabled.with(idx, available);
    localStorage.setItem('enabledTalents', this.enabled.toString());
  }

  loadEnabled(){
    const enabledStr = localStorage.getItem('enabledTalents');
    if(!enabledStr){
      return;
    }
    const newEnabled = enabledStr.split(',').map(t => t === 'true');
    if(newEnabled.length !== this.enabled.length){
      this.enabled = upgradeEnabled(newEnabled);
    } else {
      this.enabled = newEnabled;
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.loadEnabled();
    document.addEventListener('holocure-talent-toggle', this.handleToggle.bind(this))
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('holocure-talent-toggle', this.handleToggle.bind(this))
  }

  openDialogue(){
    document.dispatchEvent(new CustomEvent('holocure-open-dialogue'));
  }

  render() {
    return html`
      <section id="top">
      <h1>Holocure Randomizer Tool</h1>
      <p>Note: random character selection is back in the game <a href='#' @click=${this.openDialogue}>(more)</a></p>
      <button @click=${this.roll}>Roll</button>
      ${this.selected in talents ? html`
      <article>
        <h2>${talents[this.selected].name ?? 'Unknown Talent'}</h2>
        <img src=${talents[this.selected].full}/>
      </article>` : nothing
      }
      </section>
      <section id="bottom">
        <holocure-talent-gallery enabled=${this.enabled}></holocure-talent-gallery>
        <footer>Not affiliated in any way with Hololive, Cover Corp., or the HoloCure team. Art from the HoloCure game.</footer>
      </section>
    `
  }

  static styles = css`
    :host {
      margin: 0;
      height: 100vh;
      @media screen and (max-width:810px){
        min-height: calc(460px + 45vw);
      }
      @media screen and (max-width: 610px){
        min-height: 700px;
      }
      @media screen and (min-width:810px){
        min-height: 850px;
      }
      width: 100vw;
      text-align: center;
      display:flex;
      flex-direction: column;
      justify-content:space-between;
    }

    #top {
      flex-grow: 1;
      display:flex;
      flex-direction: column;
      align-items: center;
      > article {
        container-type: size;
        align-self: stretch;
        flex-grow: 1;
        > h2 {
          margin-block: 1rem;
        }
        > img {
          min-height: 200px;
          @container (height > 0){
            height: calc(100cqh - 5.25rem);
            max-height: 450px;
            image-rendering: crisp-edges;
          }
        }
      }
    }

    h1 {
      font-size: 3.2em;
      line-height: 1.1;
      margin-block: 1rem 0rem;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: .6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #3382f9;
      cursor: pointer;
      transition: border-color .25s;
    }
    button:hover {
      background-color: #0058ca;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    holocure-talent-gallery {
      min-width:max-content;
      --img-width: 4.5rem;
      @media screen and (max-width: 810px){
        --img-width: 8.8vw;
      }
      @media screen and (max-width: 610px){
        display: none;
      }
    }

    footer {
      width: 100%;
      display:flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      padding: 0.5rem;
      padding-top: 0.3rem;
      background-color: #3382f9;
      box-sizing: border-box;
    }

    #bottom {
      align-self: stretch;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'holocure-main-content': HolocureMainContent
  }
  interface DocumentEventMap {
    'holocure-open-dialogue': CustomEvent<void>
  }
}
