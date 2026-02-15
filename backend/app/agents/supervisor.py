from agno.agent import Agent
from agno.models.google import Gemini
from app.agents.librarian import fundamental_analyst
from app.agents.quant import technical_analyst
from app.agents.journalist import sentiment_analyst
from app.agents.aggregator import aggregator_agent
from app.core.config import settings

class FinancialSupervisor:
    def __init__(self):
        self.model = Gemini(id=settings.GEMINI_MODEL)
        
    def get_agent(self):
        return Agent(
            name="Supervisor",
            model=self.model,
            team=[
                fundamental_analyst,
                technical_analyst,
                sentiment_analyst,
                aggregator_agent
            ],
            instructions=[
                "You are the Lead Financial Strategist and Manager.",
                "1. Analyze the user's request.",
                "2. Delegate sub-tasks to the specialist agents (Quant, Librarian, Journalist).",
                "3. IMPORTANT: Once you have reports from the specialists, YOU MUST pass their findings to the Aggregator Agent.",
                "4. The Aggregator Agent will write the final report. Do not write the final report yourself.",
                "5. Return the final output from the Aggregator Agent.",
            ],
            markdown=True,
        )

supervisor_agent = FinancialSupervisor().get_agent()