class Game {
    constructor(assets) {
        this.pause = false;
        this.gameOver = false;
        this.assets = assets;
        this.player = null;
        this.balls = []; 
        this.powers = [];
        this.particles = [];
        this.BallsSpawnPoints = [
            new Vector2(0, 0),
            new Vector2(0, 0),
            new Vector2(0, 0)
        ];

        this.timeToSpawnBall = 5;
        this.timeToSpawnBallAux = 5;

        this.points = 0;

        this.backgroundX = 0;
        this.backgroundSpeed = 0.03;

        window.addEventListener('blur', () => {
            this.pause = true;
        });
    }

    Start() {
        this.points = 0;
        this.BallsSpawnPoints[0] = new Vector2(canvas.width / 2, 0);
        this.BallsSpawnPoints[1] = new Vector2(canvas.width / 1.2, 0);
        this.BallsSpawnPoints[2] = new Vector2(canvas.width / 5, 0);

        sounds.menuMusic.audio.loop = true;
        sounds.menuMusic.audio.volume = 0.1;
        sounds.menuMusic.audio.currentTime = 0;
        sounds.menuMusic.audio.play();

        this.player = new Player(new Vector2(canvas.width / 2, canvas.height - 100), 1, this.assets.cannon.img);
    }

    Update(deltaTime) {

        if (this.gameOver) {
            savePunt = this.points;
            ChangeScene(2);
        }
        else
        {

            if (Input.IsKeyDown(KEY_ESCAPE))
                this.pause = !this.pause;
                
            if (!this.pause) {
                this.player.Update(deltaTime);
                this.balls.forEach(obstacl => obstacl.Update(deltaTime));
                this.powers.forEach(power => power.Update(deltaTime));

                for (let j = this.powers.length - 1; j >= 0; j--) {
                    if (CheckCollisionCircle(this.powers[j].position, this.player.position, this.player.boundingRadius2)) {
                        this.player.ActivatePower(this.powers[j].powerTipe);
                        this.powers.splice(j, 1);
                    }
                }

                for (let i = this.player.bullets.bullets.length - 1; i >= 0; i--) {
                    const bullet = this.player.bullets.bullets[i];

                    if (bullet.active) {
                        
                        for (let j = this.balls.length - 1; j >= 0; j--) {
                            const ball = this.balls[j];
                            
                            if (CheckCollisionCircle(bullet.position, ball.position, ball.boundingRadius2)) {
                                this.points += 2;
                                const enemyKilled = ball.Damage(bullet.damage);
                                
                                bullet.pop_.play();
                                this.player.bullets.Deactivate(bullet);
                                
                                if (enemyKilled) {
                                    if (ball.size > 1) {
                                        const smallStone1 = new Stone(ball.img, new Vector2(ball.position.x + 1, ball.position.y), ball.initialLife / 2, ball.size - 1, true);
                                        const smallStone2 = new Stone(ball.img, new Vector2(ball.position.x - 1, ball.position.y), ball.initialLife / 2, ball.size - 1, true);
                                        
                                        this.balls.push(smallStone1, smallStone2);

                                    } else if (ball.size <= 1) {
                                        let random = RandomBetweenInt(0, 4);
                                        
                                        if (random == 0) {
                                            const newPower = new Power(ball.position, RandomBetweenInt(1, 2));
                                            this.powers.push(newPower);
                                        }
                                    }
                                    ball.destroy_.play();
                                    let particleNum = RandomBetweenInt(10,50);

                                    for(let i = particleNum; i >= 0; i--){
                                        switch(ball.img){
                                        
                                            case this.assets.ball1.img:
                                                this.particles.push(new Particle (ball.position, '#39D2F0', 'circle'));
                                                break;
                                            case this.assets.ball2.img:
                                                this.particles.push(new Particle (ball.position, '#7059E7', 'circle'));
                                                break;
                                            case this.assets.ball3.img:
                                                this.particles.push(new Particle (ball.position, '#EF7352', 'circle'));
                                                break;
                                            case this.assets.ball4.img:
                                                this.particles.push(new Particle (ball.position, '#E565BE', 'circle'));
                                                break;
                                            default :
                                                this.particles.push(new Particle (ball.position, '#EF7352', 'circle'));
                                                break;
                                        }
                                        
                                    }
                                    this.balls.splice(j, 1);
                                }
                            }
                        }
                    }
                }

                for (let i = this.balls.length - 1; i >= 0; i--) {
                    const enemyPos = this.balls[i].position;
                    const dist = Vector2.SqrMagnitude(enemyPos, this.player.position);

                    if (dist < this.balls[i].boundingRadius2 + this.player.boundingRadius2) {
                        if (!this.player.powers.inmortality){
                            this.gameOver = true;
                            sounds.menuMusic.audio.pause();
                            }
                    }
                }

                this.timeToSpawnBallAux -= deltaTime;
                if (this.timeToSpawnBallAux <= 0) {
                    let spawnPos = RandomBetweenInt(0, this.BallsSpawnPoints.length - 1);
                    let random = RandomBetweenInt(1, 4);
                    let obstacle = null;

                    switch (random) {
                        case 1:
                            obstacle = new Stone(this.assets.ball1.img, this.BallsSpawnPoints[spawnPos], RandomBetweenInt(2, 20), RandomBetweenInt(1, 3), false);
                            break;
                        case 2:
                            obstacle = new Stone(this.assets.ball2.img, this.BallsSpawnPoints[spawnPos], RandomBetweenInt(2, 20), RandomBetweenInt(1, 3), false);
                            break;
                        case 3:
                            obstacle = new Stone(this.assets.ball3.img, this.BallsSpawnPoints[spawnPos], RandomBetweenInt(2, 20), RandomBetweenInt(1, 3), false);
                            break;
                        case 4:
                            obstacle = new Stone(this.assets.ball4.img, this.BallsSpawnPoints[spawnPos], RandomBetweenInt(2, 20), RandomBetweenInt(1, 3), false);
                            break;
                        default:
                            obstacle = new Stone(this.assets.ball1.img, this.BallsSpawnPoints[spawnPos], RandomBetweenInt(2, 20), RandomBetweenInt(1, 3), false);
                            break;
                    }

                    this.balls.push(obstacle);
                    this.timeToSpawnBallAux = this.timeToSpawnBall;

                    if(this.timeToSpawnBall > 0.5)
                        this.timeToSpawnBall *= 0.95;

                }
            }

            this.particles.forEach((particle, index) => {
                if (particle.opacity <= 0) {
                    this.particles.splice(index, 1);
                } else {
                    particle.Update(deltaTime);
                }
            });
        }
    }

    Draw(ctx) {
        ctx.save();

        this.backgroundX = -(this.player.position.x * this.backgroundSpeed) % canvas.width;

        if (this.backgroundX < 0) {
            this.backgroundX += canvas.width;
        }

        ctx.drawImage(this.assets.backGround.img, this.backgroundX - canvas.width, 0, canvas.width + 1, canvas.height);
        ctx.drawImage(this.assets.backGround.img, this.backgroundX, 0, canvas.width + 1, canvas.height);
    
        ctx.restore();

        ctx.save();
        ctx.drawImage(this.assets.ground.img, 0, 0, 1280, 202, 0, canvas.height - 200, canvas.width, 200);
        ctx.restore();

        this.particles.forEach(particle => particle.Draw(ctx));
        this.balls.forEach(obstacle => obstacle.Draw(ctx));
        this.powers.forEach(power => power.Draw(ctx));
    
        // Dibujar al jugador
        this.player.Draw(ctx);
    
        ctx.save();
        ctx.translate(canvas.width / 2, 40);
        ctx.drawImage(this.assets.frame.img, 0, 0, 375, 313, -100, -25, 200, 50);
    
        ctx.filter = "drop-shadow(0px 0px 10px black)";
        ctx.drawImage(this.assets.frame.img, 0, 0, 375, 313, -100, -25, 200, 50);
        ctx.restore();
    
        ctx.fillStyle = "white";
        ctx.font = "30px Boogaloo";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.points, canvas.width / 2, 40);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeText(this.points, canvas.width / 2, 40);

        if(this.pause){
            ctx.fillStyle = "black";
            ctx.font = "100px Boogaloo";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Pause", canvas.width / 4, 100);
        }
    
    }
}