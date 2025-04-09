class Player {
    constructor(initialPosition, life, img) {
        this.img = img;
        this.imgAux = img;

        this.spriteSeet = [
            {x: 0, y: 0},
            {x: 375, y: 0},
        ];

        this.spriteSeetShield = [
            {x: 10, y: 0},
            {x: 353, y: 0},
            {x: 706, y: 0},
            {x: 1059, y: 0}
        ];

        this.shieldFrameIndex = 0;
        this.shieldIntervalId = null;

        this.position = initialPosition;
        this.rotation = 0;
        this.targetRotation = 0;
        this.point = 1;

        this.speed = 1000;
        this.speedRotation = 5;
        this.speedMult = 1.5;

        this.wheelRotation = 0;

        this.movement = Vector2.Zero();

        this.life = life;

        this.fireRate = 0.1;
        this.fireRateAux = 0;
        this.shotting = false;

        this.boundingRadius = 30;
        this.boundingRadius2 = this.boundingRadius * this.boundingRadius;

        this.bullets = new BulletPool(this, 1);

        this.inmortalitySphere = false;
        this.inmortalitySphereTimer = 0;

        this.powerTimers = {
            multyShot_: 5,
            inmortality_: 6,
        };

        this.powerTimersAux = {
            multyShot_: 0,
            inmortality_: 0,
        };

        this.powers = {
            multyShot: false,
            inmortality: false,
        };
    }

    Update(deltaTime) {
        this.movement.Set(0, 0);
        this.shotting = false;

        if ((Input.IsKeyPressed(KEY_A) || Input.IsKeyPressed(KEY_LEFT)) && !Input.IsMousePressed()) {
            this.movement.x -= 0.1;
            this.wheelRotation -= 0.2;
        }
        if ((Input.IsKeyPressed(KEY_D) || Input.IsKeyPressed(KEY_RIGHT)) && !Input.IsMousePressed()) {
            this.movement.x += 0.1;
            this.wheelRotation += 0.2;
        }

        this.fireRateAux += deltaTime;

        if (Input.IsMousePressed()) {
            this.shotting = true;

            if (Math.abs(Input.mouse.x - this.position.x) > 10) {
                this.movement.x = Input.mouse.x - this.position.x;

                if (Input.mouse.x < this.position.x) {
                    this.wheelRotation -= 0.2;

                } else if (Input.mouse.x > this.position.x) {
                    this.wheelRotation += 0.2;
                }
            }
            this.shot();
        }

        if (Input.IsKeyPressed(KEY_SPACE)) {
            this.shotting = true;
            this.shot();
        }

        this.movement.Normalize();

        //se aplica el movimiento
        this.position.x += this.movement.x * this.speed * deltaTime;

        if (this.position.x < canvas.width / 100 + this.boundingRadius)
            this.position.x = canvas.width / 100 + this.boundingRadius;

        if (this.position.x > canvas.width - this.boundingRadius)
            this.position.x = canvas.width - this.boundingRadius;

        this.bullets.Update(deltaTime);

        this.bullets.bullets.forEach(bullet => {
            if (bullet.active) {
                if (bullet.position.y < 0) {
                    this.bullets.Deactivate(bullet);
                }
            }
        });

        if (this.powers.multyShot) {
            this.powerTimersAux.multyShot_ += deltaTime;
            if (this.powerTimersAux.multyShot_ >= this.powerTimers.multyShot_) {
                this.powerTimersAux.multyShot_ = 0;
                this.powers.multyShot = false;
            }
        }

        if (this.powers.inmortality) {
            this.powerTimersAux.inmortality_ += deltaTime;
            if (this.powerTimersAux.inmortality_ >= 2 && this.shieldFrameIndex < 3) {

                if (this.shieldIntervalId === null) { 
                    this.shieldIntervalId = setInterval(() => {
                        this.shieldFrameIndex++;
                        console.log(this.shieldFrameIndex);

                        if (this.shieldFrameIndex >= 3) {
                            clearInterval(this.shieldIntervalId);
                            this.shieldIntervalId = null;
                        }
                    }, 900);
                }
            }

            if (this.powerTimersAux.inmortality_ >= this.powerTimers.inmortality_) {
                this.inmortalitySphere = false;
                this.powerTimersAux.inmortality_ = 0;
                this.powers.inmortality = false;
                this.shieldFrameIndex = 0;

                if (this.shieldIntervalId !== null) {
                    clearInterval(this.shieldIntervalId);
                    this.shieldIntervalId = null;
                }
            }
        }
    }

    Draw(ctx) {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(1, 1);

        if (!this.shotting)
            ctx.drawImage(this.img, this.spriteSeet[0].x, this.spriteSeet[0].y, 375, 630, -30, -65, 60, 107);
        else
            ctx.drawImage(this.img, this.spriteSeet[1].x, this.spriteSeet[1].y, 375, 630, -30, -65, 60, 107);

        ctx.restore();

        ctx.save();
        ctx.translate(this.position.x - 35, this.position.y + 30);
        ctx.rotate(this.wheelRotation); 
        ctx.drawImage(assets.wheel.img, 0, 0, 354, 354, -32, -32, 64, 64);
        ctx.restore();      
        //se dibujan las dos ruedas
        ctx.save();
        ctx.translate(this.position.x + 35, this.position.y + 30);
        ctx.rotate(this.wheelRotation);
        ctx.drawImage(assets.wheel.img, 0, 0, 354, 354, -32, -32, 64, 64);
        ctx.restore();

        if (this.inmortalitySphere) { //se dibuja la esfera del escudo
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.scale(0.5, 0.5);
            ctx.drawImage(assets.shield.img, this.spriteSeetShield[this.shieldFrameIndex].x, this.spriteSeetShield[this.shieldFrameIndex].y, 335, 335, -335 / 2, -335 / 2, 335, 335);
            ctx.restore();
        }

        this.bullets.Draw(ctx);
    }

    ActivatePower(power) {

        switch (power) {
            case 1:
                if (!this.powers.multyShot)
                    this.powers.multyShot = true;
                else
                    this.powerTimersAux.multyShot_ = 0;
                break;

            case 2:
                if (!this.powers.inmortality) {
                    this.shieldFrameIndex = 0;
                    this.powers.inmortality = true;
                    this.inmortalitySphere = true;
                } else {
                    this.shieldFrameIndex = 0;
                    this.inmortalitySphere = true;
                    this.powerTimersAux.inmortality_ = 0;
                }
                break;
        }
    }

    shot(){
         
        if(this.fireRateAux >= this.fireRate){

            if(!this.powers.multyShot){
                const bulletPosition = new Vector2(this.position.x, this.position.y - 50);
                const bullet = this.bullets.Activate();
                bullet.position = bulletPosition;
                bullet.rotation = 0 - PIH;
                bullet.speed = 1000;
                bullet.damage = 1;
    
                this.fireRateAux = 0.0;
    
            }else if(this.powers.multyShot){
                const bulletPosition = new Vector2(this.position.x, this.position.y - 60);
                const bullet = this.bullets.Activate();
                console.log(bullet)
                bullet.position = bulletPosition;
                bullet.rotation = 0 - PIH;
                bullet.speed = 1000;
                bullet.damage = 1;
    
                const bulletPosition1 = new Vector2(this.position.x, this.position.y - 60);
                const bullet1 = this.bullets.Activate();
                console.log(bullet1)
                bullet1.position = bulletPosition1;
                bullet1.rotation = 0.2 - PIH;
                bullet1.speed = 1000;
                bullet1.damage = 1;
    
                const bulletPosition2 = new Vector2(this.position.x, this.position.y - 60);
                const bullet2 = this.bullets.Activate();
                console.log(bullet2)
                bullet2.position = bulletPosition2;
                bullet2.rotation = -0.2 - PIH;
                bullet2.speed = 1000;
                bullet2.damage = 1;
    
                const bulletPosition3 = new Vector2(this.position.x, this.position.y - 60);
                const bullet3 = this.bullets.Activate();
                console.log(bullet3)
                bullet3.position = bulletPosition3;
                bullet3.rotation = 0.1 - PIH;
                bullet3.speed = 1000;
                bullet3.damage = 1;
    
                const bulletPosition4 = new Vector2(this.position.x, this.position.y - 60);
                const bullet4 = this.bullets.Activate();
                console.log(bullet4)
                bullet4.position = bulletPosition4;
                bullet4.rotation = -0.1 - PIH;
                bullet4.speed = 1000;
                bullet4.damage = 1;
    
                this.fireRateAux = 0.0;
            }
        }
        
    }

}
