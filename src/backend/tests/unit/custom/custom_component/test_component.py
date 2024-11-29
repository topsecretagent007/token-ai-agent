import pytest
from langflow.components.agents import AgentComponent
from langflow.components.crewai import CrewAIAgentComponent, SequentialTaskComponent
from langflow.components.inputs import ChatInput
from langflow.components.models import OpenAIModelComponent
from langflow.components.outputs import ChatOutput
from langflow.template import Output


def test_set_invalid_output():
    chatinput = ChatInput()
    chatoutput = ChatOutput()
    with pytest.raises(ValueError, match="Method build_config is not a valid output of ChatInput"):
        chatoutput.set(input_value=chatinput.build_config)


def test_set_component():
    crewai_agent = CrewAIAgentComponent()
    task = SequentialTaskComponent()
    task.set(agent=crewai_agent)
    assert task._edges[0]["source"] == crewai_agent._id
    assert crewai_agent in task._components


def _output_required_inputs_are_in_inputs(output: Output, inputs: list[str]):
    return all(input_type in inputs for input_type in output.required_inputs)


def _assert_all_outputs_have_different_required_inputs(outputs: list[Output]):
    required_inputs = [tuple(output.required_inputs) for output in outputs]
    assert len(required_inputs) == len(set(required_inputs)), "All outputs must have different required inputs"
    return True


def test_set_required_inputs():
    chatinput = ChatInput()

    assert all(_output_required_inputs_are_in_inputs(output, chatinput._inputs) for output in chatinput.outputs)
    assert _assert_all_outputs_have_different_required_inputs(chatinput.outputs)


def test_set_required_inputs_various_components():
    chatinput = ChatInput()
    chatoutput = ChatOutput()
    task = SequentialTaskComponent()
    agent = AgentComponent()
    openai_component = OpenAIModelComponent()

    assert all(_output_required_inputs_are_in_inputs(output, chatinput._inputs) for output in chatinput.outputs)
    assert all(_output_required_inputs_are_in_inputs(output, chatoutput._inputs) for output in chatoutput.outputs)
    assert all(_output_required_inputs_are_in_inputs(output, task._inputs) for output in task.outputs)
    assert all(_output_required_inputs_are_in_inputs(output, agent._inputs) for output in agent.outputs)
    assert all(
        _output_required_inputs_are_in_inputs(output, openai_component._inputs) for output in openai_component.outputs
    )

    assert _assert_all_outputs_have_different_required_inputs(chatinput.outputs)
    assert _assert_all_outputs_have_different_required_inputs(chatoutput.outputs)
    assert _assert_all_outputs_have_different_required_inputs(task.outputs)
    assert _assert_all_outputs_have_different_required_inputs(agent.outputs)
