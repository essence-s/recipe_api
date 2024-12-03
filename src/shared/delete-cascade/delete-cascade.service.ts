import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MemoRoleService } from '../memo-role/memo-role.service';

type verificationPermissions = {
  name: string;
  permission: any;
  ids: [];
};

@Injectable()
export class DeleteCascadeService {
  constructor(
    private readonly prisma: PrismaService,
    private memoRoleService: MemoRoleService,
  ) {}

  async infoIdRelation(
    idd,
    tablecfuntion: {
      name: string;
      typePermission: string;
      verificationPermissions: {
        name: string;
        checkRelation: string;
        permission: any;
      }[];
    },
  ): Promise<verificationPermissions[] | any> {
    let dataDeleteId = [+idd];
    let dataPromises = [];

    const nameTable = tablecfuntion.name;
    const permissionFirst = tablecfuntion.typePermission;
    const verificationPermissions = tablecfuntion.verificationPermissions;

    const firstR = await this.prisma[nameTable].findMany({
      where: {
        id: +idd,
      },
      select: {
        id: true,
      },
    });

    if (firstR.length == 0) return false;

    dataPromises.push({
      name: nameTable,
      // checkRelation: item.checkRelation,
      ids: dataDeleteId,
      permission: permissionFirst,
    });

    for (const item of verificationPermissions) {
      const dataDelete = await this.prisma[item.name].findMany({
        where: {
          [item.checkRelation]: { in: dataDeleteId },
        },
        select: {
          id: true,
        },
      });

      dataDeleteId = dataDelete.map((dd) => dd.id);
      console.log(dataDeleteId);

      if (dataDeleteId.length == 0) break;

      dataPromises.push({
        name: item.name,
        checkRelation: item.checkRelation,
        ids: dataDeleteId,
        permission: item.permission,
      });
    }
    console.log(dataPromises);
    throw new HttpException(
      {
        message: 'there are relationships',
        relatedTables: dataPromises,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async deleteRelations(
    arrayDeleteRelation: {
      name: string;
      permission: any;
      ids: [];
    }[],
  ) {
    const transaction = await this.prisma.$transaction(async (tx) => {
      for (const item of arrayDeleteRelation) {
        const dataDelete = await tx[item.name].deleteMany({
          where: {
            id: { in: item.ids },
          },
        });
        console.log('dino ' + dataDelete);
        if (!dataDelete) {
          throw new Error('ff');
        }
      }
    });

    return transaction;
    // console.log(arrayDeleteRelation);
    // return arrayDeleteRelation;
  }

  checkingPermissions(roleUser, arrayDeleteRelation) {
    const dataRole = this.memoRoleService
      .getRoles()
      .find((role) => role.name == roleUser);

    const checkingPermissions = arrayDeleteRelation.every((adr) => {
      // console.log(adr);
      // console.log(ad)
      // console.log(dataRole.permission.find((perm) => perm.name == adr.name));
      return dataRole.permission.find((perm) => perm.name == adr.name)
        .permission[adr.permission];
    });

    return checkingPermissions;
  }

  async reassignTo(id, idReassign, checkRelation, table: string) {
    const firstR = await this.prisma[table].updateMany({
      where: {
        [checkRelation]: +id,
      },
      data: {
        [checkRelation]: +idReassign,
      },
    });

    return firstR;
  }

  async reassign(id, tablecfuntion, idReassign, roleTokenRequest) {
    const name = tablecfuntion.reassign.name;
    const permission = tablecfuntion.reassign.permission;

    const hasPermissions = this.checkingPermissions(roleTokenRequest, [
      {
        name: name,
        permission: permission,
      },
    ]);

    if (!hasPermissions) {
      throw new UnauthorizedException('does not have the necessary permits');
    }

    const resultInfoRelation = await this.infoIdRelation(id, tablecfuntion);
    const resultReassing = await this.reassignTo(
      id,
      idReassign,
      resultInfoRelation[1].checkRelation,
      resultInfoRelation[1].name,
    );
    return resultReassing;
  }

  async deleteCascade(id, dataPermisionG, roleTokenRequest) {
    const resultInfoRelation = await this.infoIdRelation(id, dataPermisionG);

    const hasPermissions = this.checkingPermissions(
      roleTokenRequest,
      resultInfoRelation,
    );

    if (!hasPermissions) {
      throw new UnauthorizedException('does not have the necessary permits');
    }

    const result = await this.deleteRelations(
      [...resultInfoRelation].reverse(),
    );
    return result;
  }
}
