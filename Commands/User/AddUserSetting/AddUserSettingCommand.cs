﻿namespace MAS.Payments.Commands
{
    using MAS.Payments.DataBase;
    using MAS.Payments.Infrastructure.Command;

    public class AddUserSettingCommand: ICommand
    {
        public string Name { get; set; }

        public string RawValue { get; set; }

        public string TypeName { get; set; }

        private AddUserSettingCommand(string name, string rawValue, SettingDataValueType dataValueType)
        {
            Name = name;
            RawValue = rawValue;
            TypeName = dataValueType.ToString();
        }

        public AddUserSettingCommand(string name, int value)
            : this(name, value.ToString(), SettingDataValueType.Int32)
        {
        }

        public AddUserSettingCommand(string name, bool value)
            : this(name, value.ToString(), SettingDataValueType.Boolean)
        {
        }

        public AddUserSettingCommand(string name, string value)
            : this(name, value, SettingDataValueType.String)
        {
        }
    }
}