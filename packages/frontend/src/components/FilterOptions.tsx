import React, { FC } from "react";
import { Input, Select, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { OrderType } from "../types";

export interface IFilterOptionsProps {
  onChange: (value: string) => void;
  onOrderChange: (order: OrderType) => void;
  searchText: string;
  selectValue?: OrderType;
}

const FilterOptions: FC<IFilterOptionsProps> = ({
  onChange,
  onOrderChange,
  searchText,
  selectValue
}) => {
  const orderOptions = [
    {
      label: "Orden: Creación",
      value: OrderType.Creation
    },
    {
      label: "Orden: Modificación",
      value: OrderType.Modification
    },
    {
      label: "Orden: Nombre A-Z",
      value: OrderType.NameAZ
    },
    {
      label: "Orden: Nombre Z-A",
      value: OrderType.NameZA
    }
  ];
  const t = useTranslate();

  return (
    <>
      <ViewOptions>
        <OrderSelect
          height="40px"
          options={orderOptions}
          onChange={onOrderChange}
          selectConfig={{ isSearchable: false }}
          value={selectValue}
        />
      </ViewOptions>
      <SearchInput
        value={searchText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          e && e.target && onChange(e.target.value)
        }
        placeholder={t("filter.text.placeholder")}
      />
    </>
  );
};

export default FilterOptions;

const OrderSelect = styled(Select)`
  height: 40px;
  width: 216px;
`;

const SearchInput = styled(Input)`
  flex: inherit;
  height: 40px;
  padding: 12px 19px;
  width: 216px;
`;

const ViewOptions = styled.div`
  margin-right: 10px;
`;
