import { LitElement, css, html } from 'lit'
import { customElement} from 'lit/decorators.js'

@customElement('holocure-dialogue')
export class HolocureDialogue extends LitElement {

  connectedCallback(): void {
      super.connectedCallback();
      document.addEventListener('holocure-open-dialogue', this.openDialog);
      document.addEventListener('pointerdown', this.handleOutsideClick);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('holocure-open-dialogue', this.openDialog);
    document.addEventListener('pointerdown', this.handleOutsideClick);
  }

  _dialogEl?:HTMLDialogElement;
  get dialogEl(){
    if(!this._dialogEl){
      const el = this.shadowRoot?.querySelector('dialog') ?? undefined;
      console.log(el);
      if(el){
        this._dialogEl = el;
      }
    }
    return this._dialogEl;
  } 

  openDialog = ()=>{
    this.dialogEl?.showModal();
  }

  closeDialog = ()=>{
    this.dialogEl?.close();
  }

  handleOutsideClick = (e:PointerEvent) => {
    if(!this.dialogEl?.open){
      return;
    }
    const rect = this.dialogEl.getBoundingClientRect();
    if(rect.top > e.clientY || rect.bottom < e.clientY || rect.left > e.clientX || rect.right < e.clientX){
      this.closeDialog();
    }
  }

  render() {
    return html`
      <dialog>
        <button autofocus @click=${this.closeDialog}>x</button>
        <h2>About</h2>
        <p>This app was originally made during holocure patch 0.6, where the option to randomly select a character was not present.<br>
        As of 0.7, this option is actually back, despite not being advertised. If you press your "third action button", the character picker will randomly shuffle until you confirm. (defaults to <kbd>ctrl</kbd> on keyboard or the left face button on controller)</p>
        <p>Despite this, I will continue to maintain this, both for visibility, and because I support filtering the character pool</p>
      </dialog>
    `
  }

  static styles = css`
    dialog {
      background-color: #242424;
      width: 80%;
      max-width: 1000px;
      border: 2px solid #1D1D1D;
      border-radius: 0.75rem;
      h2 {
        margin: 0;
        text-align: center;
      }
      button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        border: 1px solid #353535;
        padding: 0.3rem 0.5rem 0.36rem;
        border-radius: 0.5rem;
        cursor: pointer;
      }
      
    }
    ::backdrop {
      background-color: #0007;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'holocure-dialogue': HolocureDialogue
  }
}
