function imgLoad(arr) {
    const promiseArr = [];
    arr.forEach(item => {
        promiseArr.push(
            new Promise((resolve, reject) => {
                const img = new Image();
                img.src = item;
                img.onload = () => {
                    resolve(img);
                };
            })
        );
    });
    return Promise.all(promiseArr);
}
export class LoginAnimation {
    constructor($) {
        this.canvas = document.getElementById('loginAnimation');
        this.ctx = this.canvas.getContext('2d');
        this.width = $('#loginAnimation').width();
        this.height = this.width * 0.71;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    init() {
        let windmillNum = 1;
        let carNum = 1;
        const imgArr = ['./static/img/loginBg.png', './static/img/windmill.png', './static/img/car.png', './static/img/door.png'];
        imgLoad(imgArr).then(data => {
            const bg = data[0];
            const windmill = data[1];
            const car = data[2];
            const door = data[3];
            setInterval(() => {
                this.ctx.save();
                this.ctx.clearRect(0, 0, this.width, this.height);
                this.ctx.drawImage(bg, 0, 0, this.width, this.height);
                this.ctx.translate(this.width / 253 + this.width / 6.4 / 2, this.height / 5.04 + this.width / 6.4 / 2);
                this.ctx.rotate((windmillNum * Math.PI) / 180);
                this.ctx.drawImage(windmill, -(this.width / 6.4 / 2), -(this.width / 6.4 / 2), this.width / 6.4, this.width / 6.4);
                this.ctx.restore();
                if (carNum > 600) {
                    this.ctx.drawImage(car, this.width / 2.15 - (carNum - 600), this.height / 2.8 + (carNum - 600) / 1.35, this.width / 10, this.width / 10);
                } else {
                    this.ctx.drawImage(car, this.width / 2.15, this.height / 2.8, this.width / 10, this.width / 10);
                }
                this.ctx.drawImage(car, this.width / 2 - carNum, this.height / 2.6 + carNum / 1.6, this.width / 10, this.width / 10);
                this.ctx.drawImage(door, this.width / 3.9, this.height / 1.55, this.width / 18, this.width / 9);
                windmillNum++;
                carNum = carNum + 2;
            }, 33);
        });
    }
}
