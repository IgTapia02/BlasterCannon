class Stone {
    constructor(img, initialPosition, life, size, spliceRock) {
        this.img = img;
        this.position = Vector2.Copy(initialPosition);
        this.rotation = 0;
        this.rotationSpeed = RandomBetweenFloat(-0.08,0.08);
        this.initialLife = life;

        if(this.initialLife<1)
          this.initialLife = 1;

        this.life = life;
        this.spliceRock = spliceRock;
  
        this.size = size;

        this.BOUNDING_RADIUS_SCALE = 15;
    
        this.boundingRadius = this.size * this.BOUNDING_RADIUS_SCALE;
        this.boundingRadius2 = this.boundingRadius * this.boundingRadius;
    
        this.movement = Vector2.Zero();
        this.movement.x = RandomBetweenFloat(-1,1);
        this.speed = 200;
        this.speedAuxx = this.speed / 1.5;
    
        this.MIN_ANGLE = -Math.PI / 2;
        this.MAX_ANGLE = Math.PI / 2;

        this.timer = 0;
        
        this.direction = {
          up: false,
          down: true,
        };

        if(spliceRock)
        {
          this.direction.up = true;
          this.direction.down = false;

          this.speedAuxy = 50;
          this.speedAuxx  = this.speed;
        }

        this.sizes = [
          {width: 32, height: 32},
          {width: 40, height: 40},
        ];

        this.sizesindex = 0;

        this.particles = [];

        this.bote_ = new Audio(sounds.bouncing.audio.src);
        this.destroy_ = new Audio(sounds.destroy.audio.src);
        
    }
  
    Update(deltaTime) {
      this.rotation -= this.rotationSpeed;
   
      if (this.position.y > canvas.height - this.boundingRadius - 60) {
        this.bote_.play();

        this.timer = 0;
        this.speed = RandomBetweenInt(250,400);

        this.direction.up = true;
        this.direction.down = false;

        let particleNum = RandomBetweenInt(10,50);

        for(let i = particleNum; i >= 0; i--){
          this.particles.push(new Particle (new Vector2(this.position.x, this.position.y + this.boundingRadius), '#fff ', 'circle'));
        }
      }
  
      if (this.speedAuxy <= 0) {
        this.timer = 0;
        this.direction.down = true;
        this.direction.up = false;
      }
  
      if (this.position.x < 0 + this.boundingRadius) {
        this.movement.x = RandomBetweenFloat(0.5,1);
        this.movement.y = Math.sin(RandomBetweenFloat(this.MIN_ANGLE, this.MAX_ANGLE));     
      }
  
      if (this.position.x > canvas.width - this.boundingRadius) {
        this.movement.x = RandomBetweenFloat(-1,-0.5);
        this.movement.y = Math.sin(RandomBetweenFloat(this.MIN_ANGLE, this.MAX_ANGLE));
      }
      
      switch (true) {
        case this.direction.down:
            
          this.timer += deltaTime;
            
            if(this.speedAuxy < this.speed)
                this.speedAuxy = 200 * this.timer;
            else
                this.speedAuxy = this.speed;

          this.movement.y = 1;
          break;

        case this.direction.up:
            
          this.timer += deltaTime;
            
          if(this.speedAuxy > 0)
                this.speedAuxy = this.speed - 200 * this.timer;
            else if(this.speedAuxy < 0)
                this.speedAuxy = 0;
            
          this.movement.y = -1;
          break;
      }

      this.position.x += this.movement.x * this.speedAuxx * deltaTime;
      this.position.y += this.movement.y * this.speedAuxy * deltaTime;

      this.particles.forEach((particle, index) => {
        if (particle.opacity <= 0)
            this.particles.splice(index, 1);
         else
            particle.Update(deltaTime);
      });
    }
  
    Draw(ctx) {
      ctx.save();
    
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.rotation + PIH);
      ctx.scale(this.size,this.size);

      ctx.drawImage(this.img, 0, 0, 353, 353, -this.sizes[this.sizesindex].width/2, -this.sizes[this.sizesindex].height/2, this.sizes[this.sizesindex].width, this.sizes[this.sizesindex].height);

      ctx.fillStyle = "white";
      ctx.font = "20px Boogaloo";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(Math.floor(this.life+1), 0, 0);

      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.strokeText(Math.floor(this.life+1), 0, 0);

      ctx.restore();

      this.particles.forEach(particle => particle.Draw(ctx));
    }
  
    Damage(damage) {
      let intervalID = setInterval(()=>{

        this.sizesindex ++;

        if (this.sizesindex>=this.sizes.length) {
            clearInterval(intervalID);
            this.sizesindex = 0;
        }
    }, 25);

      this.life -= damage;
      return Math.floor(this.life) < 1;
    }
  }
