import { PermissionRepository } from "./permission.repository.js";

export const createPermission = async (body) => {
  try {

    const existing =
      await PermissionRepository.findByRoleAndModule(
        body.roleId,
        body.module
      );

    if (existing) {
      return {
        success: false,
        message:
          "Permission already exists for this module",
      };
    }

    const permission =
      await PermissionRepository.create({
        roleId: Number(body.roleId),

        module: body.module,

        canView: body.canView || false,
        canCreate: body.canCreate || false,
        canEdit: body.canEdit || false,
        canDelete: body.canDelete || false,
      });

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
  id,
  body
) => {
  try {

    const permission =
      await PermissionRepository.update(
        id,
        {
          module: body.module,

          canView: body.canView,
          canCreate: body.canCreate,
          canEdit: body.canEdit,
          canDelete: body.canDelete,
        }
      );

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