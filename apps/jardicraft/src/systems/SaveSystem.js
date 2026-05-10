export class SaveSystem {
  static key = 'jardicraft_fp_save_v1';
  static load(){
    try { return JSON.parse(localStorage.getItem(this.key)); } catch(e){ return null; }
  }
  static save(data){
    localStorage.setItem(this.key, JSON.stringify({...data, savedAt: Date.now(), version: window.JARDICRAFT_VERSION || '1.0.0'}));
  }
  static clear(){ localStorage.removeItem(this.key); }
  static hasSave(){ return !!this.load(); }
}
