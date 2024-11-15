import { HTMLTemplateResult, LitElement, css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { talents, rows, Talent } from './talents';

@customElement('holocure-talent-gallery')
export class HolocureTalentGallery extends LitElement {

  @property({converter:(str)=>str?.split(',').map(s => s === 'true')}) enabled:boolean[] = new Array(talents.length).fill(true);

  _rows?:Talent[][];
  get rows(){
    if(this._rows){
      return this._rows;
    }

    let out:HTMLTemplateResult[][] = [];
    talents.forEach((t,idx) => {
      if(!out.at(-1) || out.at(-1)!.length === rows[out.length - 1]){
        out.push([]);
      }
      out.at(-1)?.push(this.renderIcon(t,idx));
    });
    return out;
  }

  emitToggle(idx:number, available:boolean){
    document.dispatchEvent(new CustomEvent('holocure-talent-toggle',{detail:{idx,available}}))
  }
  
  renderIcon(t:Talent, idx:number){
    const enabled = this.enabled[idx];
    return html`<img @click=${()=>this.emitToggle(idx,!enabled)} src=${t.icon} class=${!enabled ? 'gray' : nothing}/>`
  }

  render() {
    return html`<h3>Toggle character availability</h3>${this.rows?.map(row => html`<div>${row}</div>`)}`;
  }

  static styles = css`
    :host{
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    div {
      display: flex;
      gap: 4px;
      justify-content:center;
      align-items:center;
    }
    img {
      height: 3rem;
      width: 4.5rem;
      object-fit: cover;
      border: .15rem solid #555;
      cursor: pointer;

      &.gray{
        filter:grayscale();
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'holocure-talent-gallery': HolocureTalentGallery
  }
  interface DocumentEventMap {
    'holocure-talent-toggle': CustomEvent<{idx:number, available:boolean}>
  }
}
