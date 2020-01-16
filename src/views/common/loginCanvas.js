export class LoginAnimation {
  constructor ($) {
    this.canvas = document.getElementById('loginAnimation')
    this.ctx = this.canvas.getContext('2d')
    this.width = $('#loginAnimation').width()
    this.height = this.width * 0.71
    this.canvas.width = this.width
    this.canvas.height = this.height
  }
  init () {
    let windmillNum = 1
    let carNum = 1
    let bg = new Image()
    bg.src = './static/img/loginBg.png'
    bg.onload = () => {
      let windmill = new Image()
      windmill.src = './static/img/windmill.png'
      windmill.onload = () => {
        let car = new Image()
        car.src = './static/img/car.png'
        car.onload = () => {
          setInterval(() => {
            this.ctx.save()
            this.ctx.clearRect(0, 0, this.width, this.height)
            this.ctx.drawImage(bg, 0, 0, this.width, this.height)
            this.ctx.translate((this.width / 253) + (this.width / 6.4) / 2, this.height / 5.04 + (this.width / 6.4) / 2)
            this.ctx.rotate(windmillNum * Math.PI / 180)
            this.ctx.drawImage(windmill, -((this.width / 6.4) / 2), -((this.width / 6.4) / 2), this.width / 6.4, this.width / 6.4)
            this.ctx.restore()
            this.ctx.drawImage(car, (this.width / 2.05) - carNum, (this.height / 2.6) + carNum / 1.6, this.width / 10, this.width / 10)
            windmillNum++
            carNum = carNum + 2
          }, 33)
        }
      }
    }
  }
}
