from agno.agent import Agent
import inspect

sig = inspect.signature(Agent.__init__)
print("Constructor Arguments:")
for name, param in sig.parameters.items():
    print(f"  {name}: {param.annotation}")

print("\nMethods:")
for name, method in inspect.getmembers(Agent, predicate=inspect.isfunction):
    if not name.startswith("_"):
        print(f"  {name}")
