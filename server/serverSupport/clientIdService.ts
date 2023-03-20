/**
 * By Nicolai Haferkamp
 */
export class ClientIdService {
  private static registeredClients: client[] = [];

  private static startValue = 1000;
  public static registerNewClient(): number {
    let nextId = 0;
    if (ClientIdService.registeredClients.length == 0) {
      ClientIdService.registeredClients.push({
        id: ClientIdService.startValue,
        internatServerId: 0,
      });
      return ClientIdService.startValue;
    } else {
      for (const client of ClientIdService.registeredClients) {
        if (client.id > nextId) {
          nextId = client.id;
        }
      }
      nextId = nextId + 1;
      ClientIdService.registeredClients.push({
        id: nextId,
        internatServerId: 0,
      });
      return nextId;
    }
  }
}

export interface client {
  id: number;
  internatServerId: number;
}
