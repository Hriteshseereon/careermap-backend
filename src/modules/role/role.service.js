import { RoleRepository } from "./role.repository.js";

export const createRole = async (body) => {
  try {

    const existing =
      await RoleRepository.findByName(
        body.name
      );

    if (existing) {
      return {
        success: false,
        message: "Role already exists",
      };
    }

    const role =
      await RoleRepository.create({
        name: body.name,
        description: body.description,
      });

    return {
      success: true,
      data: role,
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getRoles = async () => {
  try {

    const roles =
      await RoleRepository.findAll();

    return {
      success: true,
      data: roles,
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getRoleById = async (id) => {
  try {

    const role =
      await RoleRepository.findById(id);

    if (!role) {
      return {
        success: false,
        message: "Role not found",
      };
    }

    return {
      success: true,
      data: role,
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateRole = async (
  id,
  body
) => {
  try {

    const role =
      await RoleRepository.update(
        id,
        {
          name: body.name,
          description:
            body.description,
        }
      );

    return {
      success: true,
      data: role,
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const deleteRole = async (id) => {
  try {

    await RoleRepository.delete(id);

    return {
      success: true,
      message:
        "Role deleted successfully",
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};