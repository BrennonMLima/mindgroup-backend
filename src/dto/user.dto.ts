export class UserDTO {
    name: string;
    email: string;
    createdAt: Date;
    id: string;
    image: Buffer;
  
    constructor(name: string, email: string, createdAt: Date, id: string, image: Buffer) {
      this.name = name;
      this.email = email;
      this.createdAt = createdAt;
      this.id = id;
      this.image = image;
    }
  
    toJson() {
      return {
        name: this.name,
        email: this.email,
        createdAt: this.createdAt,
        id: this.id,
        image: this.image
      };
    }
  }
  