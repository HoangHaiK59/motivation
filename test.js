function abc() {
    let obj = {
        i: 1,
        method: () => {
          console.log(this.i, this)
        }
    }
      
      obj.method()
}

abc()