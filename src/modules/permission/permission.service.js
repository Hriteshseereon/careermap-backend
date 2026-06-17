import { PermissionRepository } from "./permission.repository.js";

export const createPermission = async (body) => {
  try {
    const permissions = body.modules.map((module) => ({
      roleId: Number(body.roleId),
      module,
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: true,
    }));

    await PermissionRepository.createMany(
      permissions
    );

    return {
      success: true,
      message: "Permissions created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getPermissions = async () => {
  try {

    const permissions =
      await PermissionRepository.findAll();

    return {
      success: true,
      data: permissions,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

export const getPermissionById = async (id) => {
  try {

    const permission =
      await PermissionRepository.findById(id);

    if (!permission) {
      return {
        success: false,
        message: "Permission not found",
      };
    }

    return {
      success: true,
      data: permission,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

export const updatePermission = async (
  roleId,
  body
) => {
  try {

    await prisma.permission.deleteMany({
      where: {
        roleId: Number(roleId),
      },
    });

    await prisma.permission.createMany({
      data: body.modules.map((module) => ({
        roleId: Number(roleId),
        module,
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
      })),
    });

    const permissions =
      await prisma.permission.findMany({
        where: {
          roleId: Number(roleId),
        },
      });

    return {
      success: true,
      data: permissions,
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const deletePermission = async (
  id
) => {
  try {

    await PermissionRepository.delete(id);

    return {
      success: true,
      message:
        "Permission deleted successfully",
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};