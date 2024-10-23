// import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
// // import { User } from '../user/user.entity'; // Suponiendo que tienes una entidad de Usuario

// @Entity('recipes')
// export class Recipe {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   title: string;

//   @Column('text')
//   description: string;

//   @Column('text')
//   instructions: string;

//   @Column({ nullable: true })
//   imageUrl?: string;

//   @Column({ type: 'int', default: 0 })
//   prepTime: number; // Tiempo en minutos

//   @Column({ type: 'int', default: 0 })
//   cookTime: number; // Tiempo en minutos

//   @Column({ type: 'int', default: 1 })
//   servings: number; // Número de porciones

//   @Column({ default: 'easy' })
//   difficulty: string; // 'easy', 'medium', 'hard'

//   // @ManyToOne(() => User, (user) => user.recipes, { nullable: true })
//   // author: User; // Usuario autor de la receta

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   createdAt: Date;

//   @Column({
//     type: 'timestamp',
//     default: () => 'CURRENT_TIMESTAMP',
//     onUpdate: 'CURRENT_TIMESTAMP',
//   })
//   updatedAt: Date;
// }
