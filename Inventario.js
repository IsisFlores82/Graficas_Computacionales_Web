export class Inventario {

  constructor() {
    this.tomate = false;
    this.letuce = false;
    this.bread = false;

    this.hamburguer = false;

    this.rawmeat = false;
    this.donemeat = false;
    this.burnedmeat = false;

    this.soda = false;

    this.manosCalientes = false;
  }

  
  getTomate() {

    if(this.soda){
      console.log("Manos llenas");
      return '';
    }
    if(this.rawmeat){
      console.log("Se ocupa cocinar primero!");
      return '';
    }
    if(this.burnedmeat){
      console.log("Se volvió carbón!");
      return '';
    }


    this.tomate = true;
    if (this.tomate && this.letuce && this.bread && this.donemeat) {
      console.log("Hamburguesa completa");
      this.makeHamburger();
      return "Inventory/All.png";
    } 
    if (this.tomate && this.bread && this.donemeat) {
      console.log("tamate, pan y carne");
      return "Inventory/pan_tom_carne.png";
    }
    if (this.tomate && this.letuce && this.bread) {
      console.log("tomate, lechuga y pan");
      return "Inventory/pan_lec_tom.png";
    }
    if (this.tomate && this.letuce && this.donemeat) {
      console.log("tomate, lechuga y carne");
      return "Inventory/tom_carne_let.png";
    }
    if (this.tomate && this.bread) {
      console.log("pan y tomate");
      return "Inventory/pan_tom.png";
    }
    if (this.tomate && this.letuce) {
      console.log("tamate y lechuga");
      return "Inventory/let_tom.png";
    }
    if (this.tomate && this.donemeat) {
      console.log("tamate y carne");
      return "Inventory/tom_carne.png";
    }
   
    else {
      console.log("tomate");
      return "Inventory/tom.png";
    }
  }

  getLetuce() {

    if(this.soda){
      console.log("Manos llenas");
      return '';
    }
    if(this.rawmeat){
      console.log("Se ocupa cocinar primero!");
      return '';
    }
    if(this.burnedmeat){
      console.log("Se volvió carbón!");
      return '';
    }

    this.letuce = true;
    if (this.letuce && this.tomate && this.bread && this.donemeat) {
      console.log("Hamburguesa completa");
      this.makeHamburger();
      return "Inventory/All.png";
    } 
    else if (this.letuce && this.bread && this.donemeat) {
      console.log("pan, lechuga y carne");
      return "Inventory/pan_lec_carne.png";
    }
    else if (this.letuce && this.tomate && this.donemeat) {
      console.log("lechuga, tomate y carne");
      return "Inventory/tom_carne_let.png";
    }
    else if ( this.letuce && this.tomate && this.bread) {
      console.log("tomate, lechuga y pan");
      return "Inventory/pan_lec_tom.png";
    }
    else if (this.letuce && this.tomate) {
      console.log("tamate y lechuga");
      return "Inventory/let_tom.png";
    }
    else if (this.letuce && this.donemeat) {
      console.log("lechuga y carne"); 
      return "Inventory/carne_let.png";
    }
    else if (this.letuce && this.bread) {
      console.log("pan y lechuga");
      return "Inventory/lec_pan.png";
    }
    else {
      console.log("lechuga");
      return "Inventory/lech.png";
    }
  }

  getBread(){

    if(this.soda){
      console.log("Manos llenas!");
      return '';
    }
    if(this.rawmeat){
      console.log("Se ocupa cocinar primero!");
      return '';
    }
    if(this.burnedmeat){
      console.log("Se volvió carbón!");
      return '';
    }

    this.bread = true;
    if (this.bread && this.tomate && this.letuce && this.donemeat) {
      this.makeHamburger();
      console.log("Hamburguesa completa");
      return "Inventory/All.png";
    }
    else if (this.bread && this.tomate && this.letuce) {
      console.log("pan, lechuga y tomate");
      return "Inventory/pan_lec_tom.png";
    }
    else if (this.bread && this.tomate && this.donemeat) {
      console.log("pan, tomate y carne");
      return "Inventory/pan_tom_carne.png";
    }
    else if (this.bread && this.letuce && this.donemeat) {
      console.log("pan, lechuga y carne");
      return "Inventory/pan_lec_carne.png";
    }
    else if (this.bread && this.tomate) {
      console.log("pan y tomate");
      return "Inventory/pan_tom.png";
    }
    else if (this.bread && this.letuce) {
      console.log("pan y lechuga");
      return "Inventory/lec_pan.png";
    }
    else if (this.bread && this.donemeat) {
      console.log("pan y carne");
      return "Inventory/pan_carne.png";
    }
    else {
      console.log("pan");
      return "Inventory/pan.png";
    }
  }

  getRawMeat(){
    
    if(this.soda){
      console.log("Manos llenas");
    }
    else if(this.tomate || this.letuce || this.bread){
      if(this.manosCalientes){      }
      console.log("No puedes agregar carne cruda a la hamburguesa");
    }
    else {
      console.log("Carne cruda");
      this.rawmeat = true;
      return "Inventory/raw_meat.png";
    }
  }

  getDoneMeat(){
      
      if(this.soda){
        console.log("Manos llenas");
        return '';
      }
      if(this.rawmeat){
        console.log("Estufa ocupada");
        return '';
      }
      if(this.burnedmeat){
        console.log("No puedes cocinar esto!");
        return '';
      }

      this.donemeat = true;
      if(this.donemeat && this.tomate && this.letuce && this.bread){
        console.log("carne cocinada, tomate, lechuga o pan");
        console.log("Hamburguesa completa");
        this.makeHamburger();
        
        return "Inventory/All.png";
      }
      else if(this.donemeat && this.tomate && this.letuce){
        console.log("carne cocinada, tomate y lechuga");

        return "Inventory/tom_carne_let.png";
      }
      else if(this.donemeat && this.tomate && this.bread){
        console.log("carne cocinada, tomate y pan");
        
        return "Inventory/pan_tom_carne.png";
      }      
      else if(this.donemeat && this.bread){
        console.log("carne cocinada y pan");
        
        return "Inventory/pan_carne.png";
      }
      else if(this.donemeat && this.tomate){
        console.log("carne cocinada y tomate");
        
        return "Inventory/tom_carne.png";
      }
      else if(this.donemeat && this.letuce){
        console.log("carne cocinada y lechuga");
        
        return "Inventory/carne_let.png";
      }
      
      else {
        console.log("Carne cocida");
        this.donemeat = true;
        return "Inventory/carne.png";
      }
  }

  getBurnedMeat(){
    
    if(this.soda || this.rawmeat || this.donemeat || this.hamburguer || this.burnedmeat){
      console.log("Manos llenas");
    }
    else if(this.tomate || this.letuce || this.bread){
      console.log("No puedes agregar carne quemada a la hamburguesa");
    }
    else {
      console.log("Carne quemada");
      this.rawmeat = true;
      return "Inventory/ashes_meat.png";
    }
  }


  getSoda(){  
    if(this.tomate || this.letuce || this.bread || this.rawmeat || this.donemeat || this.burnedmeat || this.hamburguer){
      console.log("Ya no te cabe!");
    }
    else {
      console.log("Soda");
      this.soda = true;
      return "Inventory/soda.png";
    }
  }

  completeOrder(){
    if(this.hamburguer){
      this.trash();
      console.log("Hamburguesa completa entregada");
      return "Inventory/empty.png";
    }
    
    else if(this.tomate && this.letuce){
      this.trash();
      console.log("Ensalada entregada");
      return "Inventory/empty.png";
    }
    else if(this.bread && this.letuce && this.donemeat ){
      this.trash();
      console.log("Hamburguesa con Pan, lechuga y carne entregada");
      return "Inventory/empty.png";
    }
    else if(this.bread && this.tomate && this.donemeat ){
      this.trash();
      console.log("Hamburguesa con Pan, tomate y carne entregada");
      return "Inventory/empty.png";
    }
    else if(this.bread && this.donemeat ){
      this.trash();
      console.log("Hamburguesa sencilla entregada");
      return "Inventory/empty.png";
    }
    
    else if(this.soda){
      this.trash();
      console.log("Soda entregada");
      return "Inventory/empty.png";
    }
    else {
      console.log("No hay nada que entregar");
    }

  }

  mostrarInventario() {
    console.log("Tomate: " + this.tomate + "\n" +
      "Lechuga: " + this.letuce + "\n" +
      "Pan: " + this.bread + "\n" +
      "Carne cruda: " + this.rawmeat + "\n" +
      "Carne cocida: " + this.donemeat + "\n" +
      "Carne quemada: " + this.burnedmeat + "\n" +
      "Soda: " + this.soda
    );
  }

  makeHamburger(){
    this.tomate = false;
    this.letuce = false;
    this.bread = false;
    this.donemeat = false;

    this.hamburguer = true;
    console.log("Hamburguesa hecha!");
  }

  trash() {
    this.tomate = false;
    this.letuce = false;
    this.bread = false;

    this.rawmeat = false;
    this.donemeat = false;
    this.burnedmeat = false;

    this.hamburguer = false;
    this.soda = false;


    console.log("Inventario vaciado");
    return "Inventory/empty.png";
  }

  isInventoryEmpty(){ 
    //si tiene algo regresa false
    if(this.tomate || this.letuce || this.bread || this.rawmeat || this.donemeat || this.burnedmeat || this.hamburguer || this.soda){
      return false;
    }
    else {
      //si todo es false en el inventario regresa true
      return true;
    }
  }



}