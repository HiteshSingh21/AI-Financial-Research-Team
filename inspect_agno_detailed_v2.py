try:
    from agno.agent import Agent, Team
    print("Team class exists!")
except ImportError:
    from agno.agent import Agent
    print("Team class DOES NOT exist.")

import inspect
sig = inspect.signature(Agent.__init__)
print("Agent Constructor Arguments:")
for name in sig.parameters:
    print(f"- {name}")
