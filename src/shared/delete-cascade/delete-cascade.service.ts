import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MemoRoleService } from '../memo-role/memo-role.service';

type permissionsDeleteCascade = {
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
      permissionsDeleteCascade: {
        name: string;
        checkRelation: string;
        permission: any;
      }[];
    },
  ): Promise<permissionsDeleteCascade[] | any> {
    let dataDeleteId = [+idd];
    let dataPromises = [];

    const nameTable = tablecfuntion.name;
    const permissionFirst = tablecfuntion.typePermission;
    const permissionsDeleteCascade = tablecfuntion.permissionsDeleteCascade;

    const firstR = await this.prisma[nameTable].findMany({
      where: {
        id: +idd,
      },
      select: {
        id: true,
      },
    });

    if (firstR.length == 0) {
      throw new NotFoundException(`${nameTable} with ID ${idd} not found`);
    }

    dataPromises.push({
      name: nameTable,
      // checkRelation: item.checkRelation,
      ids: dataDeleteId,
      permission: permissionFirst,
    });

    for (const item of permissionsDeleteCascade) {
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
    return dataPromises;
  }

  async deleteRelations(
    groupArrayDeleteRelation: {
      name: string;
      permission: any;
      ids: [];
    }[][],
  ) {
    const arrayDeleteRelation = groupArrayDeleteRelation.reduce(
      (acc, arrayDeleteRelation) => {
        arrayDeleteRelation.forEach((item) => {
          const exist = acc.find((accItem) => accItem.name == item.name);
          if (!exist) {
            acc.unshift(item);
          } else {
            exist.ids.push(...item.ids);
          }
        });
        return acc;
      },
      [],
    );

    const transaction = await this.prisma.$transaction(async (tx) => {
      let results = [];

      for (const item of arrayDeleteRelation) {
        const dataDelete = await tx[item.name].deleteMany({
          where: {
            id: { in: item.ids },
          },
        });
        // console.log('dino ' + dataDelete);
        if (dataDelete.count === 0) {
          throw new Error(`No records were deleted for ${item.name}`);
        }
        results.push(dataDelete);
      }

      return results;
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

  async reassignTo(ids: number[], idReassign, checkRelation, table: string) {
    try {
      const firstR = await this.prisma[table].updateMany({
        where: {
          [checkRelation]: { in: ids },
        },
        data: {
          [checkRelation]: +idReassign,
        },
      });

      if (firstR.count == 0) {
        throw new NotFoundException(
          `no records found with ${checkRelation} [${ids.join(', ')}] in the ${table} table`,
        );
      }

      return firstR;
    } catch (error) {
      throw error;
    }
  }

  async reassign(ids: number[], tablecfuntion, idReassign, roleTokenRequest) {
    // const name = tablecfuntion.reassign.name;
    // const permission = tablecfuntion.reassign.permission;
    const { name, checkRelation, permission } = tablecfuntion.reassign;

    const hasPermissions = this.checkingPermissions(roleTokenRequest, [
      {
        name: name,
        permission: permission,
      },
    ]);

    if (!hasPermissions) {
      throw new UnauthorizedException('does not have the necessary permits');
    }

    // const resultInfoRelation = await this.infoIdRelation(id, tablecfuntion);
    // console.log('hola', resultInfoRelation);
    return await this.reassignTo(ids, idReassign, checkRelation, name);
  }

  async deleteCascade(ids: number[], dataPermisionG, roleTokenRequest) {
    const promisesResultInfoRelations = ids.map(async (id) => {
      return await this.infoIdRelation(id, dataPermisionG);
    });

    const resultInfoRelationsArrays = await Promise.all(
      promisesResultInfoRelations,
    );

    const hasPermissions = this.checkingPermissions(
      roleTokenRequest,
      resultInfoRelationsArrays[0],
    );

    if (!hasPermissions) {
      throw new UnauthorizedException('does not have the necessary permits');
    }

    return await this.deleteRelations([...resultInfoRelationsArrays]);
  }

  async deleteCascadeOrReassign(
    funcDelete,
    idReassign,
    deleteCascade,
    ids: number[],
    dataPermisionG,
    roleTokenRequest,
  ) {
    const hasReassignTo = idReassign !== undefined;
    const hasDeleteCascade = deleteCascade !== undefined;
    // console.log({ hasDeleteCascade, deleteCascade });
    if (hasReassignTo && hasDeleteCascade) {
      throw new BadRequestException(
        'Only one of "reassignTo" or "deleteCascade" query parameters can be provided.',
      );
    }

    // if (!hasReassignTo && !hasDeleteCascade) {
    //   throw new BadRequestException(
    //     'You must provide either "reassignTo" or "deleteCascade" query parameter.',
    //   );
    // }

    if (hasReassignTo) {
      return await this.reassign(
        ids,
        dataPermisionG,
        idReassign,
        roleTokenRequest,
      );
    }

    if (deleteCascade) {
      return await this.deleteCascade(ids, dataPermisionG, roleTokenRequest);
    } else if (!deleteCascade) {
      try {
        return await funcDelete();
      } catch (error) {
        if (error.code == 'P2003') {
          const resultInfoRelation = await this.infoIdRelation(
            ids,
            dataPermisionG,
          );
          throw new ForbiddenException({
            message: 'there are relationships',
            relatedTables: resultInfoRelation,
          });
        }
        throw new ForbiddenException(error);
      }
    }
  }
}
