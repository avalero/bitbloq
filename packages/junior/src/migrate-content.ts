const migrateContent = (content: any) => {
  const version = content.version || 0;

  switch (version) {
    case 0: {
      const newComponents = content.hardware.components
        .map(component => ({
          ...component,
          ports: component.port ? { main: component.port } : component.ports
        }))
        .filter(
          (component, index, components) =>
            components.findIndex(c =>
              c.ports && c.ports.main
                ? c.ports.main === component.ports.main
                : c === component
            ) === index
        );

      const newContent = {
        ...content,
        version: 1,
        hardware: {
          ...content.hardware,
          components: newComponents
        }
      };
      return migrateContent(newContent);
    }
  }

  return content;
};

export default migrateContent;
