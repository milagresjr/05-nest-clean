import type { DomainEvent } from "./domain-event.js";
import type { UniqueEntityId } from "../entities/unique-entity-id.js";
import { AggregateRoot } from "../entities/aggregate-root.js";
import { DomainEvents } from "./domain-events.js";

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

    return aggregate;
  }
}

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date;
  private aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date();
    this.aggregate = aggregate;
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id;
  }
}

describe("Domain Events", () => {
  it("Should be able to dispatch and listen to events", () => {
    const callbackSpy = vi.fn();

    // Subcriber cadastrado (Ouvindo o evento de resposta criada)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    // Criando uma resposta porém sem salvar no banco
    const aggregate = CustomAggregate.create();

    // Assegurando que o evento foi criado porém não foi disparado
    expect(aggregate.domainEvents).toHaveLength(1);

    // Salvando a resposta no banco de dados e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    // Ouve o evento e faz o que precisar ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled();
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
