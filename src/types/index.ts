import { Timestamp } from "firebase/firestore";

export enum Dialogs {
  Settings = "Settings",
  JoinRoom = "JoinRoom",
  CreateRoom = "CreateRoom",
  ConfirmDeleteAccount = "ConfirmDeleteAccount",
  ConfirmDeleteRoom = "ConfirmDeleteRoom",
  ConfirmDeleteRoomInside = "ConfirmDeleteRoomInside",
  ConfirmAbandonRoom = "ConfirmAbandonRoom",
  ConfirmAbandonRoomInside = "ConfirmAbandonRoomInside",
  ConfirmKickUser = "ConfirmKickUser",
  RoomInfoLogin = "RoomLogin",
  RoomInfoIsFull = "RoomInfoIsFull",
  JoinRoomFromURL = "joinRoomFromURL",
  AppInfo = "appInfo",
}

export enum Collection {
  Rooms = "rooms",
  Users = "users",
  Chats = "chats",
}

export enum UserField {
  Id = "id",
  DisplayName = "displayName",
}
export interface User {
  [UserField.Id]: string;
  [UserField.DisplayName]: string;
}

export type UserDataDB = Omit<User, UserField.Id>;

export type UserDataDBPartial = Partial<UserDataDB>;

export enum MessageField {
  AuthorId = "authorId",
  CreateTime = "createTime",
  Message = "message",
}

export interface Message {
  [MessageField.AuthorId]: string;
  [MessageField.CreateTime]: Timestamp;
  [MessageField.Message]: string;
}

export enum ChatField {
  Id = "id",
  Chat = "chat",
}

export interface Chat {
  [ChatField.Id]: string;
  [ChatField.Chat]: Message[];
}

export type ChatDataDB = Omit<Chat, ChatField.Id>;

export type ChatDataDBPartial = Partial<ChatDataDB>;

export enum Phase {
  SettingOptions,
  Choosing,
  Results,
}

enum OptionField {
  Id = "id",
  Name = "name",
}

interface Option {
  [OptionField.Id]: string;
  [OptionField.Name]: string;
}

enum ResultField {
  UserId = "userId",
  Ranking = "ranking",
}

interface Choice {
  [ResultField.UserId]: string;
  [ResultField.Ranking]: string[];
}

export enum RoomField {
  Id = "id",
  CreateTime = "createTime",
  GroupId = "groupId",
  ParsedGroupId = "parsedGroupId",
  Name = "name",
  GuestsIds = "guestsIds",
  Owner = "owner",
  Guests = "guests",
  PastGuests = "pastGuests",
  Phase = "phase",
  Options = "options",
  Choices = "choices",
}

export interface Room {
  [RoomField.Id]: string;
  [RoomField.CreateTime]: Timestamp;
  [RoomField.GroupId]: string;
  [RoomField.ParsedGroupId]: 0 | 1;
  [RoomField.Name]: string;
  [RoomField.GuestsIds]: string[];
  [RoomField.Owner]: User;
  [RoomField.Guests]: User[];
  [RoomField.PastGuests]: User[];
  [RoomField.Phase]: Phase;
  [RoomField.Options]: Option[];
  [RoomField.Choices]: Choice[];
}

export type RoomDataDB = Omit<Room, RoomField.Id | RoomField.ParsedGroupId>;

export type RoomDataDBPartial = Partial<RoomDataDB>;

export type RoomBasicData = Pick<Room, RoomField.Id | RoomField.Name>;

export type RoomDetailsData = Pick<
  Room,
  | RoomField.Id
  | RoomField.CreateTime
  | RoomField.ParsedGroupId
  | RoomField.Name
  | RoomField.Owner
  | RoomField.GuestsIds
  | RoomField.Guests
  | RoomField.PastGuests
  | RoomField.Phase
>;

export enum RoomRole {
  Owner,
  Guest,
}

export enum CommonErrors {
  OperationFailed = "Operation Failed. Something went wrong.",
  CouldNotFetch = "Something went wrong! Could not fetch the data.",
  LoginAsAValidUser = "Login as a valid user.",
  CouldNotLogin = "Could not login.",
  TheDocumentNotFound = "The document not found.",
  TheRoomIsFull = "The room is full.",
  DisplayNameInUse = "Display name already in use.",
}
