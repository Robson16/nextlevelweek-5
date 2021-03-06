import { getCustomRepository, Repository } from "typeorm";
import Connection from "../entities/Connection";
import ConnectionsRepository from "../repositories/ConnectionsRepository";

interface IRequest {
  id?: string;
  socket_id: string;
  user_id: string;
  admin_id?: string;
}

export default class ConnectionsService {
  private connectionsRepository: Repository<Connection>

  constructor() {
    this.connectionsRepository = getCustomRepository(ConnectionsRepository);
  }

  async create({ id, socket_id, user_id, admin_id }: IRequest) {
    const connection = this.connectionsRepository.create({
      id,
      socket_id,
      user_id,
      admin_id
    });

    await this.connectionsRepository.save(connection);

    return connection;
  }

  async findByUserId(user_id: string) {
    const connection = await this.connectionsRepository.findOne({
      user_id
    });

    return connection;
  }

  async findAllWithoutAdmin() {
    const connections = await this.connectionsRepository.find({
      where: { admin_id: null },
      relations: ['user'],
    });

    return connections;
  }

  async findBySocketID(socket_id: string) {
    const connection = this.connectionsRepository.findOne({
      socket_id
    });

    return connection;
  }

  async updateAdminID(user_id: string, admin_id: string) {
    await this.connectionsRepository
      .createQueryBuilder()
      .update(Connection)
      .set({ admin_id })
      .where('user_id = :user_id', {
        user_id,
      })
      .execute();
  }
}