from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, col, select
from sqlmodel.ext.asyncio.session import AsyncSession

from langflow.services.database.models.transactions.model import TransactionBase, TransactionTable


async def get_transactions_by_flow_id(
    db: AsyncSession, flow_id: UUID, limit: int | None = 1000
) -> list[TransactionTable]:
    stmt = (
        select(TransactionTable)
        .where(TransactionTable.flow_id == flow_id)
        .order_by(col(TransactionTable.timestamp))
        .limit(limit)
    )

    transactions = await db.exec(stmt)
    return list(transactions)


def log_transaction(db: Session, transaction: TransactionBase) -> TransactionTable:
    table = TransactionTable(**transaction.model_dump())
    db.add(table)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise
    return table
