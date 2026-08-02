const { where } = require("sequelize");
const { logger } = require("sequelize/lib/utils/logger");
const AppError = require("../utils/error/app-error");
const { StatusCodes } = require("http-status-codes");

class CrudRepo {
  constructor(model) {
    this.model = model;
    console.log(this.model);
  }
  async create(data) {
    try {
      const response = await this.model.create(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async destroy(data) {
    try {
      const response = await this.model.destroy({
        where: {
          id: data,
        },
      });
      console.log("Response =", response);
      if (response === 0) {
        throw new AppError("The resource is not found", StatusCodes.NOT_FOUND);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
  async get(data) {
    const response = await this.model.findByPk(data);
    if (!response)
      throw new AppError("Record not found", StatusCodes.NOT_FOUND);
    return response;
  }
  async getall(data) {
    try {
      const response = await this.model.findAll(data);
      return response;
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }
  async update(data) {
    try {
      const response = await this.model.update({
        where: {
          id: data,
        },
      });
      return response;
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }
}
module.exports = { CrudRepo };
