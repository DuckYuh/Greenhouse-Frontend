import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2'
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService,
                private readonly jwtService: JwtService
    ) { }

    async signin(authDto: AuthDto): Promise<{ access_token: string }> {
        // Find user in database
        const user = await this.prisma.user.findUnique({
            where: {
                email: authDto.email
            }
        })
        if (!user) {
            throw new ForbiddenException('Credentials incorrect')
        }
        // Verify password
        const passMatch = argon.verify(
            user.password,
            authDto.password
        )

        if (!passMatch) {
            throw new ForbiddenException("Credentials incorrect")
        }
        const payload = { sub: user.ID, email: user.email }
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    async signup(authDto: AuthDto) {
        const hash = await argon.hash(authDto.password)

        try {
            const user = await this.prisma.user.create({
                data: {
                    username: authDto.username,
                    email: authDto.email,
                    password: hash
                }
            })
            return user
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code == 'P2002')
                    throw new ForbiddenException('Email has been used')
            }
            throw new Error("Error occured! Please try again");
        }

    }
} 
